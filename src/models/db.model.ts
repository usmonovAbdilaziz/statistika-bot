import { connect } from "mongoose";
import {config} from 'dotenv'
config()

export const connectDb = async () => {
  try {
    await connect(String(process.env.MONGO_URI)).then(() =>
      console.log("Db connecting successfully")
    );
  } catch (error) {
    console.log("Db connecting error: ", error);
  }
};
