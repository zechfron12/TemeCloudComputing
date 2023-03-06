"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../abstracts/controller");
const db_1 = require("../database/db");
class AccountController extends controller_1.Controller {
    constructor() {
        super("accounts", db_1.db);
    }
}
exports.default = AccountController;
