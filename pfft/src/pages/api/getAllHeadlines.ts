import dbConnect from "@/database/conn";
import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import HistoryModel from "@/models/history/history.model";
async function getAllHeadlines(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(400).json({ message: "Invalid request method" });
  }
  try {
    await dbConnect();
    const matchedHeadlines = await HistoryModel.aggregate([
      {
        $sort:{
          _id: -1
        }
      }
      ,{
        $group: {
          _id: "$headline",
          latestId: { $first: "$_id" },
        },
      },
      {
        $sort:{
          latestId: -1
        }
      },
      {
        $limit: 50
      }
    ]);

    if (matchedHeadlines.length === 0) {
      return res
        .status(404)
        .json({ status: true, error: "No headlines found" });
    }
    return res.status(200).json({ status: true, headlines: matchedHeadlines.map((headline) => headline._id) });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
}
const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (
    err: any,
    _req: NextApiRequest,
    res: NextApiResponse,
    _next: any
  ) => {
    res.status(500).send(err.toString());
  },
  onNoMatch: (_req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).send("Page is not found");
  },
});

handler.get(getAllHeadlines);

export default handler;
