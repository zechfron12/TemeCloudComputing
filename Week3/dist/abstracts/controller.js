"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const getSqlQueryElements_1 = __importDefault(require("../utils/getSqlQueryElements"));
class Controller {
    tableName;
    db;
    constructor(tableName, db) {
        this.tableName = tableName;
        this.db = db;
    }
    getCollection() {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT * FROM ${this.tableName}`, (error, result) => {
                if (error)
                    return reject(error);
                return resolve(result);
            });
        });
    }
    async getItem(id) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT * FROM ${this.tableName} WHERE id=?`, [id], (err, result) => {
                if (err)
                    return reject(err);
                if (result.length === 0)
                    return reject("No item found");
                return resolve(result[0]);
            });
        });
    }
    async createItem(item) {
        return new Promise((resolve, reject) => {
            const { values, fields, questionMarks } = (0, getSqlQueryElements_1.default)(item);
            const sql = `INSERT INTO ${this.tableName} ${fields} VALUES ${questionMarks}`;
            this.db.query(sql, values, (err, result) => {
                if (err)
                    return reject(err);
                return resolve({ id: result.insertId, ...item });
            });
        });
    }
    async updateItem(id, updateObject) {
        return new Promise((resolve, reject) => {
            const { values, fields, questionMarks } = (0, getSqlQueryElements_1.default)(updateObject);
            let afterSetString = "";
            for (const key in updateObject) {
                afterSetString += key + "= ?,";
            }
            afterSetString = afterSetString.slice(0, -1);
            const sql = `UPDATE ${this.tableName} SET ${afterSetString} WHERE id = ?`;
            this.db.query(sql, [...values, id], (err, result) => {
                if (err)
                    return reject(err);
                return resolve(result);
            });
        });
    }
    async deleteItem(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM ${this.tableName} WHERE id=?`;
            this.db.query(sql, [id], (err, result) => {
                if (result.affectedRows == 0)
                    return reject("No row affected");
                return resolve(result);
            });
        });
    }
}
exports.Controller = Controller;
