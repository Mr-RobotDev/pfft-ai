import dbConnect from "@/database/conn";
import UserModel from "@/models/user/user.model";
import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "PATCH") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ message: "Method Not Allowed" });
    }
    const { userID } = req.query;
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Missing required data" });
    }

    if (!username.match(/^[a-zA-Z_]+$/)) {
      return res
        .status(400)
        .json({ message: "Invalid username. Only letters and underscores" });
    }

    await dbConnect();
    const user = await UserModel.findOne({
      _id: userID,
    });
    if (user) {
      user.username = username;
      await user.save();
      res.status(200).json({
        message: "Successfully Payment Record Saved",
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
