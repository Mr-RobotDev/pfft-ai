import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/database/conn";
import ShortModel from "@/models/shortURL/short.model";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { hash } = req.query;
  if (hash) {
    try {
      if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ message: "Method Not Allowed" });
      }
      await dbConnect();
      const campaign = await ShortModel.findOne({ uid: hash });
      if (campaign) {
        res.status(200).json({destination: campaign.link});
      }else{
        return res.status(400).json({ message: "Blog not found" });
      }
    } catch (error) {
      console.error("Error Getting Short URL :", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(400).json({ message: "Missing required data" });
  }
}
