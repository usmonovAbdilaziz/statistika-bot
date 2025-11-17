import { Context, Keyboard } from "grammy";
import { User } from "../models/db.schema";

const phoneKeyboard = new Keyboard()
  .requestContact("📱 Telefon raqamni ulash")
  .resized(); ;

function generateDaysKeyboard() {
  const keyboard = new Keyboard();
  for (let i = 1; i <= 31; i++) {
    keyboard.text(String(i)).resized();
    if (i % 7 === 0) keyboard.row();
  }
  return keyboard;
}

export const checkUser = async (ctx: Context, next: () => Promise<void>) => {
  const userId = Number(ctx.from!.id);
  let user = await User.findOne({ userId });

  // 1️⃣ Yangi user yaratish
  if (!user) {
    user = await User.create({
      userId,
      full_name: ctx.from?.first_name + " " + (ctx.from?.last_name || ""),
      username: ctx.from?.username,
      phone: "",
      daxod: 0,
      rasxod: [],
      salaryDay: 0,
    });
  }

  // 2️⃣ Telefon raqamini qabul qilish
  if (ctx.message?.contact) {
    await User.findOneAndUpdate(
      { userId },
      { phone: ctx.message.contact.phone_number }
    );

    await ctx.reply(
      "✔️ Telefon raqamingiz qabul qilindi!\n\nEndi oylik oladigan sanani tanlang:",
      { reply_markup: generateDaysKeyboard() }
    );
    return;
  }

  // 3️⃣ Agar telefon yo‘q bo‘lsa — telefon so‘rash
  if (!user.phone) {
    await ctx.reply("📱 Iltimos, telefon raqamingizni ulashing:", {
      reply_markup: phoneKeyboard,
    });
    return;
  }

  // 4️⃣ salaryDay tanlanmagan bo‘lsa — kunlarni chiqarish
  if (!user.salaryDay) {
    await ctx.reply("📅 Oylik oladigan sanani tanlang:", {
      reply_markup: generateDaysKeyboard(),
    });
    return;
  }

  await next();
};
