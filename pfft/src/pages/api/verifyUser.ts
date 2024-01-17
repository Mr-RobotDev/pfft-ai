import dbConnect from "@/database/conn";
import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";
import UserModel from "@models/user/user.model";
import PaymentRecord from "@/models/paymentRecord/paymentRecord.model";
import mongoose from "mongoose";
import {sendSignUpEmail} from "@utils/EmailHelper";

const verifyUser = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("---------> VERIFY USER::")
  if (req.method !== "GET") {
    return res.status(400).json({ message: "Invalid request method" });
  }
  const token = req.query.token as unknown as string;
  console.log(token);

  try {
    await dbConnect();

    const user = await UserModel.findOne({verificationToken: token});
    if(user) {
      user.isVerified = true;
      await user.save();

      const paymentRecord = new PaymentRecord({
        user_id: new mongoose.Types.ObjectId(user._id),
        isFreeCredit: true,
        credit: process.env.FREE_CREDIT_AMOUNT,
        email: user.email
      });

      await paymentRecord.save();
      sendSignUpEmail(user, process.env.FREE_CREDIT_AMOUNT, '1.49');
    }else {
      return res.status(404).json({ error: "Invalid token" });
    }

    return res.json({message: 'User verified successfully.', status: true});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err: any, _req: NextApiRequest, res: NextApiResponse, _next: any) => {
    res.status(500).send(err.toString());
  },
  onNoMatch: (_req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).send("Page is not found");
  },
});

handler.get(verifyUser);

export default handler;
