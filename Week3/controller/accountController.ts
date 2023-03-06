import { Controller } from "../abstracts/controller";
import { Account } from "../models/account";
import { db } from "../database/db";

export default class AccountController extends Controller<Account> {
  constructor() {
    super("accounts", db);
  }
}
