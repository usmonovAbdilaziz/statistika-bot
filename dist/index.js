"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const bot_routes_1 = require("./command/bot.routes");
const db_model_1 = require("./models/db.model");
const user_middlware_1 = require("./guard/user.middlware");
const db_schema_1 = require("./models/db.schema");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const PORT = Number(process.env.PORT);
const bot = new grammy_1.Bot(String(process.env.BOT_TOKEN));
bot.hears(/^[0-9]{1,2}$/, async (ctx) => {
    const day = Number(ctx.message.text);
    if (day < 1 || day > 31)
        return;
    const userId = ctx.from.id;
    await db_schema_1.User.findOneAndUpdate({ userId }, { salaryDay: day });
    await ctx.reply(`✔️ Oylik kuni saqlandi. Xar oyni ${day}-kuni endi daxodni yuboring, \n/daxod kiritish Misol: /daxod 4 mln 500 min, yoki 4 mln,`, {
        reply_markup: { remove_keyboard: true },
    });
});
bot.use(user_middlware_1.checkUser);
(async () => {
    await (0, bot_routes_1.botRoutes)(bot);
    await (0, db_model_1.connectDb)();
    bot.start();
    console.log("Bot startting on port", PORT);
})();
