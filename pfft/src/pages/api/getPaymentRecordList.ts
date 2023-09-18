import dbConnect from "@/database/conn";
import StripeModel from "@/models/stripe/stripe.model";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ message: "Method Not Allowed" });
    }
    await dbConnect();
    const lastDocument = await StripeModel.findOne({})
      .sort({ _id: -1 }) // Sort by descending order of _id to get the last document
      .exec();

    if (!lastDocument) {
      return res.status(404).json([0]);
    }

    res.status(200).json([lastDocument.orderNo]);
  } catch (error) {
    console.error("Error Getting Last Document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
