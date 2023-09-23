import { NextApiRequest, NextApiResponse } from "next";
import { customAlphabet } from "nanoid";
import dbConnect from "@/database/conn";
import ShortModel from "@/models/shortURL/short.model";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const getHash = customAlphabet(characters, 4);

export default async function CreateLink(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "GET") {
    return response.status(405).json({
      type: "Error",
      code: 405,
      message: "Only POST method is accepted on this route",
    });
  }
  const { link } = request.query;
  if (!link) {
    response.status(400).send({
      type: "Error",
      code: 400,
      message: "Expected {link: string}",
    });
    return;
  }
  try {
    await dbConnect();

    const hash = getHash();
    const linkExists = await ShortModel.findOne({
      link,
    });
    const shortUrl = `${process.env.NEXTAUTH_UR_BLOG}${hash}`;
    if (!linkExists) {
      const shortURL = new ShortModel({
        link: link,
        uid: hash,
        shortUrl: shortUrl,
        createdAt: new Date(),
      });

      await shortURL.save();
    }
    response.status(200).json({shortUrl: linkExists?.shortUrl || shortUrl});
   
  } catch (e: any) {
    response.status(500);
    response.send({
      code: 500,
      type: "error",
      message: e.message,
    });
  }
}
