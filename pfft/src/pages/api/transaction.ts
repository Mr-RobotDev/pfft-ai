import dbConnect from "@/database/conn";
import StripeModel from "@/models/stripe/stripe.model";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as any, {
  apiVersion: process.env.NEXT_PUBLIC_STRIPE_API_VERSION as any,
});

async function getTransactionHistory(
  customerId: string,
  startingAfter?: string
): Promise<Stripe.ApiList<Stripe.Charge>> {
  const options: Stripe.ChargeListParams = {
    customer: customerId,
    limit: 10, // Number of transactions to retrieve per page
    starting_after: startingAfter,
  };

  const transactions = await stripe.charges.list(options);
  return transactions;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { startingAfter, userID } = req.query;
    if (!userID) {
      return res.status(400).json({ error: "User ID is required." });
    }
    await dbConnect();
    const stripeRecords = await StripeModel.findOne({ user_id: userID });

    if (stripeRecords !== null) {
      const customerId = stripeRecords.customer_id;
      if (startingAfter === "") {
        const transactions = await getTransactionHistory(customerId as string);
        res.status(200).json(transactions);
      } else {
        const transactions = await getTransactionHistory(
          customerId as string,
          startingAfter as string
        );
        res.status(200).json(transactions);
      }
    } else {
      res.status(200).json({
        message: "No Transactions Available",
      });
    }
  } catch (error) {
    console.error("Error retrieving transaction history:", error);
    res.status(500).json({
      error: "An error occurred while retrieving transaction history.",
    });
  }
};

export default handler;
