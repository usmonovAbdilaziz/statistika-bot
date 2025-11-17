"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const connectDb = async () => {
    try {
        await (0, mongoose_1.connect)(String(process.env.MONGO_URI)).then(() => console.log("Db connecting successfully"));
    }
    catch (error) {
        console.log("Db connecting error: ", error);
    }
};
exports.connectDb = connectDb;
