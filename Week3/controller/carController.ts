import { Controller } from "../abstracts/controller";
import { db } from "../database/db";
import { Car } from "../models/car";

export default class CarController extends Controller<Car> {
  constructor() {
    super("cars", db);
  }
}
