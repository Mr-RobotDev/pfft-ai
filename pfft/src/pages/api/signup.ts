import bcrypt from 'bcryptjs';
import handler from "@utils/handler";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/database/conn";
import UserModel from "@/models/user/user.model";

const { promisify } = require('util');
const crypto = require('crypto');

//import PaymentRecord from "@/models/paymentRecord/paymentRecord.model";
//import mongoose from "mongoose";
import { sendVerificationEmail } from "@utils/EmailHelper";


const saltRounds = 10; // Adjust according to your security needs

// Generate a random verification token
const generateVerificationToken = () => crypto.randomBytes(32).toString('hex');

// Hash a token for secure storage
const hashToken = async (token: any) => {
  const hash = await promisify(bcrypt.hash)(token, saltRounds);
  return hash;
};

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "Invalid request method" });
  }
  try {
    await dbConnect();
    //@ts-ignore
    const newUser = await UserModel.findOneOrCreate(req.body);
    if (newUser.alreadyExist === true) {
      return res.status(406).json({ message: "User Already Exists!" });
    } else {

      const user = await UserModel.findOne({ email: req.body.email });

      const verificationToken = generateVerificationToken();
      const hashedToken = await hashToken(verificationToken);

      if (user != null) {
      user.verificationToken = hashedToken;
      user.isVerified = false;
      await user.save();
      }

      const verificationLink = `https://pfft.ai/verify/${hashedToken}`;

      sendVerificationEmail(newUser, verificationLink);

      /*const paymentRecord = new PaymentRecord({
        user_id: new mongoose.Types.ObjectId(newUser._id),
        isFreeCredit: true,
        credit: process.env.FREE_CREDIT_AMOUNT,
        email: newUser.email
      });

      await paymentRecord.save();
      sendSignUpEmail(newUser, process.env.FREE_CREDIT_AMOUNT, '1.49');
      */
      return res.status(201).json({ message: "User Created!" });
    }
  } catch (error: any) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Username already exists" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

handler.post(createUser);

export default handler;
