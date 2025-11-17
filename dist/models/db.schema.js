"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    userId: { type: Number, required: true, unique: true },
    full_name: { type: String, required: true },
    salaryDay: { type: Number, default: 0 },
    username: { type: String },
    phone: { type: String },
    balance: { type: Number, default: 0 },
    daxod: { type: Number, default: 0 },
    rasxod: [
        {
            price: { type: Number, required: true },
            createdAt: { type: Date, default: Date.now },
        }
    ],
}, { timestamps: true } // ✅ timestamps yoqildi
);
exports.User = (0, mongoose_1.model)("User", UserSchema);
