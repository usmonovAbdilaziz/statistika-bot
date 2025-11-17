"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthNotif = exports.DailySalaryNotif = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const db_schema_1 = require("../models/db.schema");
const DailySalaryNotif = async (bot) => {
    try {
        const users = await db_schema_1.User.find();
        node_cron_1.default.schedule("0 0 19 * * *", // har kuni soat 19:00
        async () => {
            const today = new Date().getDate(); // bugungi kun (1-31)
            for (const user of users) {
                if (user.salaryDay === today) {
                    try {
                        let total = 0;
                        user.rasxod.forEach((item) => {
                            total += Number(item.price);
                        });
                        await bot.api.sendMessage(user.userId, `Kunlik eslatma!\nBugun siz ${total} sum uzingiz uchun sarfladingiz.`);
                    }
                    catch (err) {
                        console.log("Xatolik userId:", user.userId, err.message);
                    }
                }
            }
        }, { timezone: "Asia/Tashkent" });
    }
    catch (error) {
        console.log("Send notif error", error);
    }
};
exports.DailySalaryNotif = DailySalaryNotif;
const MonthNotif = async (bot) => {
    try {
        const users = await db_schema_1.User.find();
        node_cron_1.default.schedule("0 0 18 10 * *", // har oyning 10-sanasida soat 18:00
        async () => {
            console.log("Xabar yuborish boshlandi:", new Date());
            for (const user of users) {
                try {
                    await bot.api.sendMessage(user.userId, "Salom bugun daxodni uzgartiradigan agar daxod uzgargan bulsa qayta tuzamizmi.");
                }
                catch (err) {
                    console.log("Xatolik userId:", user.userId, err.message);
                }
            }
        }, { timezone: "Asia/Tashkent" });
    }
    catch (error) {
        console.log("Send notif error", error);
    }
};
exports.MonthNotif = MonthNotif;
