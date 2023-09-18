import handler from "@utils/handler";
import type { NextApiRequest, NextApiResponse } from "next";

import User from "@/models/user/user.model";

import dbConnect from "../../database/conn";
import PaymentRecord from "@/models/paymentRecord/paymentRecord.model";
import mongoose from "mongoose";

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "Invalid request method" });
  }
  try {
    await dbConnect();
    //@ts-ignore
    const newUser = await User.findOneOrCreate(req.body);
    if (newUser.alreadyExist === true) {
      return res.status(406).json({ message: "User Already Exists!" });
    } else {
      const paymentRecord = new PaymentRecord({
        user_id: new mongoose.Types.ObjectId(newUser._id),
        isFreeCredit: true,
        credit: process.env.FREE_CREDIT_AMOUNT,
      });

      await paymentRecord.save();
      return res.status(201).json({ message: "User Created!" });
    }
  } catch (error : any) {
    console.error(error);
    if (error.code === 11000) {
        return res.status(400).json({ error: "Username already exists" });
      }
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

handler.post(createUser);

export default handler;
