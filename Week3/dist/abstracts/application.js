"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const getReqData_1 = __importDefault(require("../utils/getReqData"));
let key = {};
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
class Application {
    path;
    controller;
    request;
    response;
    constructor(path, controller) {
        this.path = path;
        this.controller = controller;
    }
    setReqAndRes(request, response) {
        this.request = request;
        this.response = response;
    }
    listenRequests() {
        const regex = new RegExp(`\/api\/${this.path}\/([0-9]+)`);
        if (this.request.url === `/api/${this.path}` &&
            this.request.method === "GET") {
            this.get();
            return true;
        }
        if (this.request.url === `/api/${this.path}` &&
            this.request.method === "POST") {
            this.post();
            return true;
        }
        if (this.request.url.match(regex) && this.request.method === "GET") {
            this.getById();
            return true;
        }
        if (this.request.url.match(regex) && this.request.method === "DELETE") {
            this.delete();
            return true;
        }
        if (this.request.url.match(regex) && this.request.method === "PATCH") {
            this.patch();
            return true;
        }
        if (this.request.url.match(regex) && this.request.method === "PUT") {
            this.put();
            return true;
        }
        return false;
    }
    async get() {
        const collection = await this.controller.getCollection();
        this.response.writeHead(200, { "Content-Type": "application/json" });
        this.response.end(JSON.stringify(collection));
    }
    async getById() {
        try {
            const id = this.request.url.split("/")[3];
            const item = await this.controller.getItem(id);
            this.response.writeHead(200, { "Content-Type": "application/json" });
            this.response.end(JSON.stringify(item));
        }
        catch (error) {
            this.response.writeHead(404, { "Content-Type": "application/json" });
            this.response.end(JSON.stringify({ message: error }));
        }
    }
    async delete() {
        try {
            const id = this.request.url.split("/")[3];
            let message = await this.controller.deleteItem(id);
            this.response.writeHead(200, { "Content-Type": "application/json" });
            this.response.end(JSON.stringify({ message }));
        }
        catch (error) {
            this.response.writeHead(404, { "Content-Type": "application/json" });
            this.response.end(JSON.stringify({ message: error }));
        }
    }
    async patch() {
        try {
            const id = this.request.url.split("/")[3];
            let itemData = await (0, getReqData_1.default)(this.request);
            let updatedItem = await this.controller.updateItem(id, JSON.parse(itemData));
            this.response.writeHead(200, { "Content-Type": "application/json" });
            this.response.end(JSON.stringify(updatedItem));
        }
        catch (error) {
            let statusCode = 404;
            if (error.errno == 1054)
                statusCode = 400;
            this.response.writeHead(statusCode, {
                "Content-Type": "application/json",
            });
            this.response.end(JSON.stringify({ message: error }));
        }
    }
    async put() {
        try {
            const id = this.request.url.split("/")[3];
            let itemData = await (0, getReqData_1.default)(this.request);
            let updatedItem;
            let myItem = JSON.parse(itemData);
            for (const k in key[this.path]) {
                if (!(k in myItem))
                    throw { errno: 12345, errMessage: "There are missing fields" };
            }
            updatedItem = await this.controller.updateItem(id, myItem);
            if (updatedItem.affectedRows == 0)
                throw { errMessage: "Item not found" };
            this.response.writeHead(201, { "Content-Type": "application/json" });
            this.response.end(JSON.stringify(updatedItem));
        }
        catch (error) {
            let statusCode = 404;
            if (error.errno == 1054)
                statusCode = 400;
            if (error.errno == 12345)
                statusCode = 400;
            this.response.writeHead(statusCode, {
                "Content-Type": "application/json",
            });
            this.response.end(JSON.stringify({ message: error }));
        }
    }
    async post() {
        try {
            let itemData = await (0, getReqData_1.default)(this.request);
            let item = await this.controller.createItem(JSON.parse(itemData));
            this.response.writeHead(200, { "Content-Type": "application/json" });
            this.response.end(JSON.stringify(item));
        }
        catch (error) {
            let statusCode = 400;
            if (error.errno == 1062)
                statusCode = 409;
            this.response.writeHead(statusCode, {
                "Content-Type": "application/json",
            });
            this.response.end(JSON.stringify({ message: error.sqlMessage }));
        }
    }
}
exports.Application = Application;
