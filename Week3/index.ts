import * as http from "http";
import AccountController from "./controller/accountController";
import { Account } from "./models/account";
import * as dotenv from "dotenv";
import { Application } from "./abstracts/application";
import { Car } from "./models/car";
import CarController from "./controller/carController";

dotenv.config();

const PORT = process.env.PORT;

const accountsApp = new Application<Account>(
  "accounts",
  new AccountController()
);
const carsApp = new Application<Car>("cars", new CarController());

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
