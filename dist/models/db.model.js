"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const mongoose_1 = require("mongoose");
const connectDb = async () => {
    try {
        await (0, mongoose_1.connect)("mongodb://127.0.0.1:27017/statistika").then(() => console.log("Db connecting successfully"));
    }
    catch (error) {
        console.log("Db connecting error: ", error);
    }
};
exports.connectDb = connectDb;
