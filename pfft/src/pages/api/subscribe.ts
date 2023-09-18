import { toCents } from "@/utils/helper";
import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(process.env.STRIPE_SECRET_KEY);
    if (req.method !== "POST") {
      return res.status(400).json({ message: "Invalid request method" });
    }

    const { name, email, paymentMethod, toPay } = req.body;

    if (!name || !email || !paymentMethod || !toPay) {
      return res.status(400).json({ message: "Missing required data" });
    }

    // Create a customer
    const customer = await stripe.customers.create({
      email,
      name,
      payment_method: paymentMethod,
      invoice_settings: { default_payment_method: paymentMethod },
    });

    // Create a product
    const product = await stripe.products.create({
      name: "Monthly subscription",
    });
    // Create a price
    const price = await stripe.prices.create({
      currency: "USD",
      unit_amount: toCents(parseFloat(toPay)),

      recurring: { interval: "month" },
      product: product.id,
    });

    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });

    // Send back the client secret for payment
    const expiresOn = new Date(subscription.current_period_end * 1000);
    res.json({
      message: "Subscription successfully initiated",
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      customer: customer.id,
      expires: expiresOn,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
