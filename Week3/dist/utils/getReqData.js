"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getReqData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                resolve(body);
            });
        }
        catch (error) {
            reject("There is an error");
        }
    });
}
exports.default = getReqData;
