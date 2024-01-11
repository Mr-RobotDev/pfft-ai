import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
// import fetch from "node-fetch";



async function GenerateHeadlines(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "Invalid request method" });
  }
  try {
    const response = await fetch(
      `${process.env.PFFT_AI_API_URL}/generate_headline`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const headlines = await response.json();

    res.status(200).json(headlines);
  } catch (error:any) {
    console.log(error);
    res.status(500).json({ error: "An error occurred", data: error.message });
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

handler.post(GenerateHeadlines);

export default handler;
