import dbConnect from "@/database/conn";
import PaymentRecord from "@/models/paymentRecord/paymentRecord.model";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userID, credit } = req.body;
  if (userID && credit) {
    try {
      if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ message: "Method Not Allowed" });
      }
      await dbConnect();
      await PaymentRecord.updateOne(
        { user_id: userID },
        {
          $inc: { credit: parseFloat(credit) },
          $set: { isFreeCredit: false },
        },
        { upsert: true }
      );
      res.status(200).json({ message: "Credit Updated" });
    } catch (error) {
      console.error("Error Getting User Payment Details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(400).json({ message: "Missing required data" });
  }
}
