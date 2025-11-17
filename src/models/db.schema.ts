import { model, Schema, Document } from "mongoose";

interface IUser extends Document {
  userId: number;
  full_name: string;
  salaryDay:number;
  username?: string;
  phone?: string;
  daxod: number;
  balance:number;
  rasxod: IRasxod[];
  createdAt: Date;
  updatedAt: Date;
}
//rasxod uchun
export interface IRasxod {
  price: number;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    userId: { type: Number, required: true, unique: true },
    full_name: { type: String, required: true },
    salaryDay:{type:Number,default:0},
    username: { type: String },
    phone: { type: String },
    balance:{type:Number,default:0},
    daxod: { type: Number, default: 0 },
    rasxod: [
    {
      price: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now },
    }
  ],
  },
  { timestamps: true } // ✅ timestamps yoqildi
);

export const User = model<IUser>("User", UserSchema);
