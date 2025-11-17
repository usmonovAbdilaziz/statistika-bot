"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.botRoutes = void 0;
const db_schema_1 = require("../models/db.schema");
const bot_controller_1 = require("../controller/bot.controller");
const controller = new bot_controller_1.BotController();
const botRoutes = async (bot) => {
    bot.command("start", async (ctx) => {
        const userId = ctx.from.id;
        const user = await db_schema_1.User.findOne({ userId });
        if (user?.daxod === 0) {
            ctx.reply("Salom xush kelibsiz xarajatlaringizni xisoblash uchun iltimos Daxod ni kiriting,\n Misol: /daxod 3 mln, yoki /daxod 300 ming ");
            return;
        }
        if (user) {
            ctx.reply(`Qaytganingizdan xursandmiz, \nSizning daxodingiz: ${user.daxod} edi uzgartirmaysizmi, \nSungi yangilanish: ${new Date(user.createdAt).toLocaleString()} `);
        }
    });
    bot.command("help", (ctx) => {
        ctx.reply(`/start botni ishga tushuradi,
        \n/daxod yangi daxod kiritasiz Misol: /daxod 4 mln 500 min, yoki 4 mln,
        \nDaxodni uzgartirish /daxod (oldingi daxod) change (yangi daxod)
        \n/rasxod kiritish, Misol: /rasxod 2 mln, yoki 200 min
        \nBarcha rasxodlarni kurish: /rasxod`);
    });
    bot.command("daxod", async (ctx) => {
        const mess = ctx.message.text.toLowerCase().split(" ");
        const message = mess;
        if (mess.includes("change")) {
            await controller.changeDaxod(ctx, message);
            return;
        }
        if (mess[0] === "/daxod") {
            await controller.addBot(ctx, message);
            return;
        }
    });
    bot.command("rasxod", async (ctx) => {
        const mess = ctx.message.text.toLowerCase().split(" ");
        const message = mess;
        if (mess.length === 1) {
            const userId = ctx.from.id;
            const user = await db_schema_1.User.findOne({ userId });
            ctx.reply("Bugungi rasxodlar !!!");
            if (!user || user.rasxod.length === 0) {
                ctx.reply(`Siz hali rasxod qilmadingiz.\nDaxod: ${user?.daxod}`);
                return;
            }
            const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
            const todayRasxod = user.rasxod.filter((item) => {
                const itemDay = new Date(item.createdAt).toISOString().split("T")[0];
                return itemDay === todayStr;
            });
            if (todayRasxod.length === 0) {
                ctx.reply("Bugun rasxod qilmagansiz.");
                return;
            }
            for (const d of todayRasxod) {
                await ctx.reply(`📅 Sana: ${new Date(d.createdAt).toISOString().split("T")[0]}\n` +
                    `💸 Rasxod: ${d.price} so‘m\n` +
                    `⏱ Vaqti: ${new Date(d.createdAt).toLocaleString()}`);
            }
            return;
        }
        if (mess[0] === "/rasxod") {
            await controller.addRasxod(ctx, message);
            return;
        }
    });
    bot.command(["day", "month", "year"], async (ctx) => {
        try {
            const userId = ctx.from.id;
            const user = await db_schema_1.User.findOne({ userId });
            if (!user || !user.rasxod || user.rasxod.length === 0) {
                ctx.reply(`Siz hali rasxod qilmagansiz.\nDaxod: ${user?.daxod || 0}`);
                return;
            }
            // Qaysi komandani chaqirganini aniqlash
            const command = ctx.message.text.replace("/", "").toLowerCase();
            let filteredExpenses = [];
            const now = new Date();
            if (command === "day") {
                filteredExpenses = user.rasxod.filter((r) => {
                    console.log(user.rasxod.map((r) => r.createdAt));
                    const d = new Date(r.createdAt);
                    return (d.getDate() === now.getDate() &&
                        d.getMonth() === now.getMonth() &&
                        d.getFullYear() === now.getFullYear());
                });
            }
            else if (command === "month") {
                filteredExpenses = user.rasxod.filter((r) => {
                    const d = new Date(r.createdAt);
                    return (d.getMonth() === now.getMonth() &&
                        d.getFullYear() === now.getFullYear());
                });
            }
            else if (command === "year") {
                filteredExpenses = user.rasxod.filter((r) => {
                    const d = new Date(r.createdAt);
                    return d.getFullYear() === now.getFullYear();
                });
            }
            if (filteredExpenses.length === 0) {
                ctx.reply(`Siz bu davrda hech qanday rasxod qilmagansiz.`);
                return;
            }
            // Rasxodlarni summalash va xabar tayyorlash
            const total = filteredExpenses.reduce((acc, r) => acc + r.price, 0);
            let message = `Sizning ${command === "day" ? "kunlik" : command === "month" ? "oylik" : "yillik"} rasxodingiz:\n`;
            filteredExpenses.forEach((r, i) => {
                const dateObj = new Date(r.createdAt);
                // Sana (YYYY-MM-DD formatida)
                const date = dateObj.toISOString().split("T")[0];
                // Vaqt (HH:MM:SS formatida)
                const time = dateObj.toTimeString().split(" ")[0];
                message += `${i + 1}. ${date}:${time}: ${r.price}\n`;
            });
            message += `Jami: ${total}`;
            ctx.reply(message);
        }
        catch (error) {
            console.error(error);
            ctx.reply("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
        }
    });
};
exports.botRoutes = botRoutes;
