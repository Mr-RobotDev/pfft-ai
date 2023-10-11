import HistoryModel from "@/models/history/history.model";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
// import fetch from "node-fetch";
import mongoose from "mongoose";
import dbConnect from "@/database/conn";

async function generateArticles(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "Invalid request method" });
  }
  try {
    await dbConnect();
    const headline = req.query.headline as string;
    const userID = req.query.userID as string;
    const opinion = req.query.opinion as string;

    const response = await fetch(
      `${process.env.PFFT_AI_API_URL}/generate_article`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const article = await response.json();

    if (userID !== "undefined") {
      const history = new HistoryModel({
        article: article.article,
        userId: new mongoose.Types.ObjectId(userID),
        headline: headline,
        opinion: opinion,
      });
      await history.save().then((result: any) => {
        res.status(200).json({ article: article, blog_id: result._id });
      });
    } else {
      res.status(200).json({ article: article });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
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

handler.post(generateArticles);

export default handler;
