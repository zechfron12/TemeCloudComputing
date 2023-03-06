"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
class Controller {
    constructor(file) {
        this.collection = [];
        this.collection = require("../database/" + file)[file];
    }
    getCollection() {
        return new Promise((resolve, _) => resolve(this.collection));
    }
    getItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const item = this.collection.find((item) => item.id === id);
                if (item) {
                    resolve(item);
                }
                else {
                    reject(`Item with id ${id} not found `);
                }
            });
        });
    }
    createItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, _) => {
                const newItem = Object.assign({ id: Math.floor(Math.random() * 100000) }, item);
                this.collection.push(newItem);
                resolve(newItem);
            });
        });
    }
    updateItem(id, updateObject) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let index = -1;
                let item = this.collection.find((item, i) => {
                    if (item.id === id) {
                        index = i;
                        return true;
                    }
                    return false;
                });
                if (!item) {
                    reject(`No Item with id ${id} found`);
                }
                item = Object.assign(Object.assign({}, item), updateObject);
                this.collection[index] = item;
                resolve(item);
            });
        });
    }
    deleteItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let index = -1;
                const item = this.collection.find((item, i) => {
                    if (item.id === id) {
                        index = i;
                        return true;
                    }
                    return false;
                });
                if (index !== -1) {
                    this.collection.splice(index, 1);
                }
                if (!item) {
                    reject(`No Item with id ${id} found`);
                }
                resolve(item);
            });
        });
    }
}
exports.Controller = Controller;
