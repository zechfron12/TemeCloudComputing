"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getQueryParams(url) {
    const paramArr = url.slice(url.indexOf("?") + 1).split("&");
    let params = {};
    paramArr.map((param) => {
        const [key, val] = param.split("=");
        params[key] = decodeURIComponent(val);
    });
    return params;
}
exports.default = getQueryParams;
