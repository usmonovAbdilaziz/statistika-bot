import Cron from "node-cron";
import { User } from "../models/db.schema";

export const DailySalaryNotif = async (bot: any) => {
  try {
    const users = await User.find();

    Cron.schedule(
      "0 0 19 * * *", // har kuni soat 19:00
      async () => {
        const today = new Date().getDate(); // bugungi kun (1-31)
        for (const user of users) {
          if (user.salaryDay === today) {
            try {
              let total: number = 0;
              user.rasxod.forEach((item:any) => {
                total += Number(item.price);
              });
              await bot.api.sendMessage(
                user.userId,
                `Kunlik eslatma!\nBugun siz ${total} sum uzingiz uchun sarfladingiz.`
              );
            } catch (err: any) {
              console.log("Xatolik userId:", user.userId, err.message);
            }
          }
        }
      },
      { timezone: "Asia/Tashkent" }
    );
  } catch (error) {
    console.log("Send notif error", error);
  }
};
export const MonthNotif = async (bot: any) => {
  try {
    const users = await User.find();

    Cron.schedule(
      "0 0 18 10 * *", // har oyning 10-sanasida soat 18:00
      async () => {
        console.log("Xabar yuborish boshlandi:", new Date());

        for (const user of users) {
          try {
            await bot.api.sendMessage(
              user.userId,
              "Salom bugun daxodni uzgartiradigan agar daxod uzgargan bulsa qayta tuzamizmi."
            );
          } catch (err: any) {
            console.log("Xatolik userId:", user.userId, err.message);
          }
        }
      },
      { timezone: "Asia/Tashkent" }
    );
  } catch (error) {
    console.log("Send notif error", error);
  }
};
