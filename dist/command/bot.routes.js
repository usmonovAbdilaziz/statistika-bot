"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.botRoutes = void 0;
const db_schema_1 = require("../models/db.schema");
const bot_controller_1 = require("../controller/bot.controller");
const controller = new bot_controller_1.BotController();
const botRoutes = async (bot) => {
    bot.command("start", (ctx) => {
        ctx.reply("Salom xush kelibsiz xarajatlaringizni xisoblash uchun iltimos Daxod ni kiriting,\n Misol: [/daxod 3,mln, yoki /daxod 3,ming] ");
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
            ctx.reply('Bugungi rasxodlar !!!');
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
};
exports.botRoutes = botRoutes;
