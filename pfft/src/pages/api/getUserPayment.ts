import dbConnect from "@/database/conn";
import PaymentRecord from "@/models/paymentRecord/paymentRecord.model";
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
      const payment = await PaymentRecord.findOne({ user_id: userID });

      res.status(200).json(payment);
    } catch (error) {
      console.error("Error Getting User Payment Details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(400).json({ message: "Missing required data" });
  }
}