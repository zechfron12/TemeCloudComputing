import * as http from "http";

export default function getReqData(req: http.IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk: any) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        resolve(body);
      });
    } catch (error) {
      reject("There is an error");
    }
  });
}
