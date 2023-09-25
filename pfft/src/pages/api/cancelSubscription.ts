import dbConnect from "@/database/conn";
import StripeModel from "@/models/stripe/stripe.model";
import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method !== "POST") {
            res.setHeader("Allow", "GET");
            return res.status(405).json({ message: "Method Not Allowed" });
        }
        const { userID } = req.query;
        const {subscriptionId} = req.body;
        if(!userID || !subscriptionId){
            return res.status(400).json({ message: "Missing required data" });
        }
        await dbConnect();
        await stripe.subscriptions.cancel(subscriptionId);
        const stripeInfo = await StripeModel.findOne({ user_id: userID, subscriptionId: subscriptionId });
        await stripeInfo?.delete();
        res.status(200).json({
            message: "Successfully Payment Record Saved",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}