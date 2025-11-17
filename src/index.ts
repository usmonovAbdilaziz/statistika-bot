import { Bot } from "grammy";
import { botRoutes } from "./command/bot.routes";
import { connectDb } from "./models/db.model";
import { checkUser } from "./guard/user.middlware";
import { User } from "./models/db.schema";

import { config } from "dotenv";
import { DailySalaryNotif, MonthNotif } from "./cron-tasks/cron.tasks";
config();
const PORT = Number(process.env.PORT);
const bot = new Bot(String(process.env.BOT_TOKEN));
bot.hears(/^[0-9]{1,2}$/, async (ctx: any) => {
  const day = Number(ctx.message.text);

  if (day < 1 || day > 31) return;

  const userId = ctx.from.id;

  await User.findOneAndUpdate({ userId }, { salaryDay: day });

  await ctx.reply(
    `✔️ Oylik kuni saqlandi. Xar oyni ${day}-kuni endi daxodni yuboring, \n/daxod kiritish Misol: /daxod 4 mln 500 min, yoki 4 mln,`,
    {
      reply_markup: { remove_keyboard: true },
    }
  );
});
bot.use(checkUser);
(async () => {
    await botRoutes(bot);
    await connectDb();
    await DailySalaryNotif(bot);
    await MonthNotif(bot);
  bot.start();
  console.log("Bot startting on port", PORT);
})();
