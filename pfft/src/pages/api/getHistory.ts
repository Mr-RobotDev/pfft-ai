import dbConnect from "@/database/conn";
import type { NextApiRequest, NextApiResponse } from "next";
import HistoryModel from "@/models/history/history.model";
import nc from "next-connect";

async function getHistory(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(400).json({ message: "Invalid request method" });
  }
  try {
    await dbConnect();
    const searchQuery = req.query.userID;

    if (searchQuery === "undefined") {
      return res.status(400).json({
        status: false,
        error: "Query parameter 'userID' is required",
      });
    } else {
      const matchedHistory = await HistoryModel.find({
        userId: searchQuery,
      });
      if (matchedHistory?.length === 0) {
        return res
          .status(404)
          .json({ status: true, error: "No matching history found" });
      }
      return res
        .status(200)
        .json({ status: true, userId: searchQuery, history: matchedHistory });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
}
const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err: any, _req: NextApiRequest, res: NextApiResponse, _next: any) => {
    res.status(500).send(err.toString());
  },
  onNoMatch: (_req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).send("Page is not found");
  },
});

handler.get(getHistory);

export default handler;