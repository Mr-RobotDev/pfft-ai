import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: async (err, _req, res) => {
    await res.status(500).send(err.toString());
  },
  onNoMatch: async (_req, res) => {
    await res.status(404).send("Page is not found");
  },
});

export default handler;
