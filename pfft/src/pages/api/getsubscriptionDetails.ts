
import dbConnect from "@/database/conn";
import StripeModel from "@/models/stripe/stripe.model";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userID } = req.query;

  if (userID) {
    try {
      if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ message: "Method Not Allowed" });
      }
      await dbConnect();
      const stripeInfo = await StripeModel.findOne({ user_id: userID });
      res.status(200).json(stripeInfo);
    } catch (error) {
      console.error("Error Getting Subscription Details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(400).json({ message: "Missing required data" });
  }
}