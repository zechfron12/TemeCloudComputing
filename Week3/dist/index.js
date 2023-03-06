"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const accountController_1 = __importDefault(require("./controller/accountController"));
const dotenv = __importStar(require("dotenv"));
const application_1 = require("./abstracts/application");
const carController_1 = __importDefault(require("./controller/carController"));
dotenv.config();
const PORT = process.env.PORT;
const accountsApp = new application_1.Application("accounts", new accountController_1.default());
const carsApp = new application_1.Application("cars", new carController_1.default());
const server = http.createServer(async (req, res) => {
    accountsApp.setReqAndRes(req, res);
    carsApp.setReqAndRes(req, res);
    if (!accountsApp.listenRequests() && !carsApp.listenRequests()) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});
server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});
