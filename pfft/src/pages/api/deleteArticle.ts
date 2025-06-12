import HistoryModel from "@/models/history/history.model";
import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import dbConnect from "@/database/conn";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(400).json({ message: "Invalid request method" });
  }
  try {
    await dbConnect();
    const userID = req.query.userID as string;
    const blogID = req.query.blogID as string;

    if (userID !== "undefined" && blogID !== "undefined") {
      await HistoryModel.deleteOne({
        userId: new mongoose.Types.ObjectId(userID),
        _id: new mongoose.Types.ObjectId(blogID),
      });
      res.status(200).json({
        message: "Article deleted successfully",
      });
    } else {
      res.status(400).json({ message: "Invalid request query" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
}
