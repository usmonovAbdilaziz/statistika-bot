"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotController = void 0;
const db_schema_1 = require("../models/db.schema");
class BotController {
    async addBot(ctx, message) {
        try {
            // Tugmalarni yaratish
            const userId = ctx.from.id;
            let daxod = 0;
            if (!message) {
                ctx.reply("Daxodni yuboring, Misol: /daxod 3 mln ");
                return;
            }
            const user = await db_schema_1.User.findOne({ userId });
            if (user?.daxod != 0) {
                ctx.reply(`Sizning daxodingiz: ${user?.daxod}\nDaxodni uzgartirmoqchi bulsangiz yangi daxodni || /daxod (eski daxod) change (yangi daxod) || kurinishda yuboring.`);
                return;
            }
            const mess = message;
            if (mess.includes("mln")) {
                daxod += Number(mess[1]) * 1000000;
            }
            if (mess.includes("min")) {
                daxod += Number(mess[3]) * 1000;
            }
            await db_schema_1.User.findOneAndUpdate({ userId }, { daxod }, { new: true });
            ctx.reply(`Sizning daxodingiz: ${daxod}`);
        }
        catch (error) {
            ctx.reply(`Add daxod error: 500 `);
            console.log("Daxod add error: ", error);
        }
    }
    async changeDaxod(ctx, message) {
        try {
            const userId = ctx.from?.id;
            let newDaxod = 0;
            const changeIndex = message.indexOf("change");
            let afterChange = [];
            if (changeIndex !== -1) {
                afterChange = message.slice(changeIndex + 1);
            }
            if (afterChange.includes("mln")) {
                newDaxod += Number(afterChange[0]) * 1000000;
            }
            if (afterChange.includes("min")) {
                newDaxod += Number(afterChange[2]) * 1000;
            }
            const user = await db_schema_1.User.findOneAndUpdate({ userId }, { daxod: newDaxod }, { new: true });
            if (!user) {
                ctx.reply("User not found pleace press /start");
            }
            ctx.reply(`Ajoyib sizning yangi daxodingiz: ${user?.daxod}`);
        }
        catch (error) {
            ctx.reply("Daxod changed error");
            console.log("Daxodni uzgartirishda xatolik", error);
        }
    }
    async addRasxod(ctx, message) {
        try {
            const userId = ctx.from?.id;
            const user = await db_schema_1.User.findOne({ userId });
            if (!user) {
                return ctx.reply("Foydalanuvchi topilmadi");
            }
            // 1. Messageni bo‘laklarga ajratamiz
            const parts = message;
            // misol: ["3", "mln", "500", "min"]
            let ras = 0;
            // 2. mln bor bo‘lsa
            const mlnIndex = parts.indexOf("mln");
            if (mlnIndex !== -1) {
                ras += Number(parts[mlnIndex - 1]) * 1000000;
            }
            // 3. min bor bo‘lsa
            const minIndex = parts.indexOf("min");
            if (minIndex !== -1) {
                ras += Number(parts[minIndex - 1]) * 1000;
            }
            console.log(parts[minIndex - 1], ras);
            // 4. Limitni tekshirish
            if (user.daxod < ras) {
                return ctx.reply(`Rasxodingiz me’yordan oshdi.\nSizning daxodingiz: ${user.daxod}`);
            }
            // 5. Balance hisoblash
            const currentBalance = user.balance === 0 ? user.daxod : user.balance;
            if (currentBalance < ras) {
                return ctx.reply(`Sizning rasxodingiz limitdan oshdi.\nQoldiq summa: ${currentBalance}`);
            }
            if (ras === 0) {
                ctx.reply(`Rasxod qilgan summa kiritilmagan, \nKiritish summa: ${ras} so'm`);
            }
            const newBalance = currentBalance - ras;
            // 6. Yangilash ($push bilan)
            const newUser = await db_schema_1.User.findOneAndUpdate({ userId }, {
                balance: newBalance,
                $push: { rasxod: { price: ras, createdAt: new Date() } },
            }, { new: true });
            ctx.reply(`Rasxod: ${ras},    \nQolgan summa: ${newUser?.balance}\nYangilangan vaqti: ${new Date(newUser.updatedAt).toLocaleString()}`);
        }
        catch (error) {
            console.log(error);
            ctx.reply("Rasxod qo‘shishda xatolik yuz berdi");
        }
    }
}
exports.BotController = BotController;
