import StripeModel from "@/models/stripe/stripe.model";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";
import dbConnect from "@/database/conn";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(400).json({ message: "Invalid request method" });
    }
    const {
      user_id,
      customer_id,
      transaction_id,
      expires,
      created,
      orderNo,
      credit,
      paid,
      subscriptionId
    } = req.body;
    if (
      !user_id ||
      !customer_id ||
      !transaction_id ||
      !expires ||
      !created ||
      !orderNo ||
      !credit ||
      !paid ||
      !subscriptionId
    ) {
      return res.status(400).json({ message: "Missing required data" });
    }
    await dbConnect();
    const stripeHistory = new StripeModel({
      user_id: new mongoose.Types.ObjectId(user_id),
      customer_id: customer_id,
      transaction_id: transaction_id,
      type: "Subscription / Visa",
      date: new Date(),
      expiry: expires,
      amount: paid,
      credit: credit,
      orderNo: orderNo,
      subscriptionId: subscriptionId
    });

    console.log(stripeHistory);

    await stripeHistory.save();

    res.status(200).json({
      message: "Successfully Payment Record Saved",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: "Internal server error" });
  }
}
