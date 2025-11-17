import { User } from "../models/db.schema";
import { BotController } from "../controller/bot.controller";
const controller = new BotController();
export const botRoutes = async (bot: any) => {
  bot.command("start", (ctx: any) => {
    ctx.reply(
      "Salom xush kelibsiz xarajatlaringizni xisoblash uchun iltimos Daxod ni kiriting,\n Misol: [/daxod 3,mln, yoki /daxod 3,ming] "
    );
  });
  bot.command("help", (ctx: any) => {
    ctx.reply(
      `/start botni ishga tushuradi,
        \n/daxod yangi daxod kiritasiz Misol: /daxod 4 mln 500 min, yoki 4 mln,
        \nDaxodni uzgartirish /daxod (oldingi daxod) change (yangi daxod)
        \n/rasxod kiritish, Misol: /rasxod 2 mln, yoki 200 min
        \nBarcha rasxodlarni kurish: /rasxod`,
      {
        parse_mode: "MarkdownV2",
      }
    );
  });
  bot.command("daxod", async (ctx: any) => {
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
  

  bot.command("rasxod", async (ctx: any) => {
    const mess = ctx.message.text.toLowerCase().split(" ");
    const message = mess;

    if (mess.length === 1) {
      let days: any[] = [];

      const userId = ctx.from.id;
      const user = await User.findOne({ userId });

      if (!user || user.rasxod.length === 0) {
        ctx.reply(`Siz hali rasxod qilmadingiz.\nDaxod: ${user?.daxod}`);
        return;
      }

      // 1. Har bir rasxodni kun bo‘yicha ajratamiz
      user.rasxod.forEach((item) => {
        const date = new Date(item.createdAt);

        // Sana faqat YYYY-MM-DD formatida
        const day = date.toISOString().split("T")[0];

        days.push({
          day,
          price: item.price,
          createdAt: item.createdAt,
        });
      });

      // 2. Har bir rasxodni alohida jo‘natamiz
      for (const d of days) {
        await ctx.reply(
          `📅 Sana: ${d.day}\n` +
            `💸 Rasxod: ${d.price} so‘m\n` +
            `⏱ Vaqti: ${new Date(d.createdAt).toLocaleString()}`
        );
      }
      return;
    }
    if (mess[0] === "/rasxod") {
      await controller.addRasxod(ctx, message);
      return;
    }
  });
};
