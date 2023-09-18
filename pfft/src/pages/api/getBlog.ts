import dbConnect from "@/database/conn";
import HistoryModel from "@/models/history/history.model";
import nc from "next-connect";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";

const getBlog = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(400).json({ message: "Invalid request method" });
  }
  const historyId = req.query.historyId as unknown as string;
  console.log(historyId);

  try {
    await dbConnect();

    const history = await HistoryModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(historyId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          article: 1,
          userId: 1,
          headline: 1,
          username: "$user.username",
        },
      },
    ]);
    if (history.length === 0) {
      return res.status(404).json({ error: "History not found" });
    }
    return res.json(history[0]);
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

handler.get(getBlog);

export default handler;
