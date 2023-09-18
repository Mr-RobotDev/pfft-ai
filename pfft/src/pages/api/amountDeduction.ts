import dbConnect from "@/database/conn";
import PaymentRecord from "@/models/paymentRecord/paymentRecord.model";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userID } = req.query;

  if (!userID) {
    return res.status(400).json({ message: "Missing required data" });
  }

  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    await dbConnect();

    const paymentInfo = await PaymentRecord.findOne({ user_id: userID });

    if (!paymentInfo) {
      return res.status(404).json({ message: "Payment information not found" });
    }

    const updatedCredit =
      paymentInfo.credit -
      (process.env.DEDUCTED_AMOUNT_FROM_CREDIT as unknown as number);
    if (updatedCredit === 0) {
      await PaymentRecord.updateOne(
        { user_id: userID },
        { credit: updatedCredit, isFreeCredit: false }
      );
    } else {
      await PaymentRecord.updateOne(
        { user_id: userID },
        { credit: updatedCredit }
      );
    }

    const updatedPaymentInfo = await PaymentRecord.findOne({ user_id: userID });
    res.status(200).json(updatedPaymentInfo);
  } catch (error) {
    console.error("Error Getting Subscription Details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
