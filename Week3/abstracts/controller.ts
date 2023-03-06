import * as mysql from "mysql2";
import getSqlQueryElements from "../utils/getSqlQueryElements";
export abstract class Controller<T> {
  constructor(private tableName: string, private db: mysql.Connection) {}
  getCollection() {
    return new Promise((resolve, reject) => {
      this.db.query(`SELECT * FROM ${this.tableName}`, (error, result) => {
        if (error) return reject(error);
        return resolve(result as T);
      });
    });
  }

  async getItem(id: string) {
    return new Promise<T>((resolve, reject) => {
      this.db.query(
        `SELECT * FROM ${this.tableName} WHERE id=?`,
        [id],
        (err, result) => {
          if (err) return reject(err);
          if ((result as T[]).length === 0) return reject("No item found");
          return resolve((result as T[])[0]);
        }
      );
    });
  }

  async createItem(item: T) {
    return new Promise((resolve, reject) => {
      const { values, fields, questionMarks } = getSqlQueryElements<T>(item);

      const sql = `INSERT INTO ${this.tableName} ${fields} VALUES ${questionMarks}`;

      this.db.query(sql, values, (err, result) => {
        if (err) return reject(err);
        return resolve({ id: (result as any).insertId, ...item });
      });
    });
  }

  async updateItem(id: string, updateObject: T) {
    return new Promise((resolve, reject) => {
      const { values, fields, questionMarks } =
        getSqlQueryElements<T>(updateObject);

      let afterSetString = "";

      for (const key in updateObject) {
        afterSetString += key + "= ?,";
      }

      afterSetString = afterSetString.slice(0, -1);

      const sql = `UPDATE ${this.tableName} SET ${afterSetString} WHERE id = ?`;

      this.db.query(sql, [...values, id], (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }

  async deleteItem(id: string) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM ${this.tableName} WHERE id=?`;

      this.db.query(sql, [id], (err, result) => {
        if ((result as any).affectedRows == 0) return reject("No row affected");
        return resolve(result);
      });
    });
  }
}
