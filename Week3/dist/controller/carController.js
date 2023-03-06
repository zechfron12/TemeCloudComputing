"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../abstracts/controller");
const db_1 = require("../database/db");
class CarController extends controller_1.Controller {
    constructor() {
        super("cars", db_1.db);
    }
}
exports.default = CarController;
