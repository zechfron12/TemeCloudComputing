import getReqData from "../utils/getReqData";
import { Controller } from "./controller";
import * as http from "http";

interface Keys {
  [key: string]: any;
}

let key: Keys = {};

key["accounts"] = {
  id: "",
  username: "",
  password: "",
  email: "",
};

key["cars"] = {
  id: "",
  color: "",
  manufacturer: "",
  plate: "",
};

export class Application<T> {
  private request!: http.IncomingMessage;
  private response!: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  };
  constructor(private path: string, private controller: Controller<T>) {}

  public setReqAndRes(
    request: http.IncomingMessage,
    response: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage;
    }
  ) {
    this.request = request;
    this.response = response;
  }

  public listenRequests() {
    const regex = new RegExp(`\/api\/${this.path}\/([0-9]+)`);
    if (
      this.request.url === `/api/${this.path}` &&
      this.request.method === "GET"
    ) {
      this.get();
      return true;
    }
    if (
      this.request.url === `/api/${this.path}` &&
      this.request.method === "POST"
    ) {
      this.post();
      return true;
    }
    if (this.request.url!.match(regex) && this.request.method === "GET") {
      this.getById();
      return true;
    }
    if (this.request.url!.match(regex) && this.request.method === "DELETE") {
      this.delete();
      return true;
    }
    if (this.request.url!.match(regex) && this.request.method === "PATCH") {
      this.patch();
      return true;
    }
    if (this.request.url!.match(regex) && this.request.method === "PUT") {
      this.put();
      return true;
    }

    return false;
  }

  public async get() {
    const collection = await this.controller.getCollection();

    this.response.writeHead(200, { "Content-Type": "application/json" });
    this.response.end(JSON.stringify(collection));
  }

  public async getById() {
    try {
      const id = this.request.url!.split("/")[3];
      const item = await this.controller.getItem(id);

      this.response.writeHead(200, { "Content-Type": "application/json" });
      this.response.end(JSON.stringify(item));
    } catch (error) {
      this.response.writeHead(404, { "Content-Type": "application/json" });
      this.response.end(JSON.stringify({ message: error }));
    }
  }

  public async delete() {
    try {
      const id = this.request.url!.split("/")[3];
      let message = await this.controller.deleteItem(id);
      this.response.writeHead(200, { "Content-Type": "application/json" });
      this.response.end(JSON.stringify({ message }));
    } catch (error) {
      this.response.writeHead(404, { "Content-Type": "application/json" });
      this.response.end(JSON.stringify({ message: error }));
    }
  }

  public async patch() {
    try {
      const id = this.request.url!.split("/")[3];

      let itemData = await getReqData(this.request);

      let updatedItem = await this.controller.updateItem(
        id,
        JSON.parse(itemData) as T
      );
      this.response.writeHead(200, { "Content-Type": "application/json" });
      this.response.end(JSON.stringify(updatedItem));
    } catch (error) {
      let statusCode = 404;

      if ((error as any).errno == 1054) statusCode = 400;

      this.response.writeHead(statusCode, {
        "Content-Type": "application/json",
      });
      this.response.end(JSON.stringify({ message: error }));
    }
  }
  public async put() {
    try {
      const id = this.request.url!.split("/")[3];
      let itemData = await getReqData(this.request);

      let updatedItem: any;

      let myItem = JSON.parse(itemData) as T;

      for (const k in key[this.path]) {
        if (!(k in (myItem as object)))
          throw { errno: 12345, errMessage: "There are missing fields" };
      }

      updatedItem = await this.controller.updateItem(id, myItem);

      if ((updatedItem as any).affectedRows == 0)
        throw { errMessage: "Item not found" };
      this.response.writeHead(201, { "Content-Type": "application/json" });
      this.response.end(JSON.stringify(updatedItem));
    } catch (error) {
      let statusCode = 404;

      if ((error as any).errno == 1054) statusCode = 400;
      if ((error as any).errno == 12345) statusCode = 400;

      this.response.writeHead(statusCode, {
        "Content-Type": "application/json",
      });
      this.response.end(JSON.stringify({ message: error }));
    }
  }

  public async post() {
    try {
      let itemData = await getReqData(this.request);
      let item = await this.controller.createItem(
        JSON.parse(itemData as string)
      );
      this.response.writeHead(200, { "Content-Type": "application/json" });
      this.response.end(JSON.stringify(item));
    } catch (error) {
      let statusCode = 400;
      if ((error as any).errno == 1062) statusCode = 409;
      this.response.writeHead(statusCode, {
        "Content-Type": "application/json",
      });
      this.response.end(JSON.stringify({ message: (error as any).sqlMessage }));
    }
  }
}
