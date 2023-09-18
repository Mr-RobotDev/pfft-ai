import { Model, model, models } from "mongoose";
import stripeSchema from "./stripe.schema";
import { StripeTypes } from "./stripe.types";

const StripeModel: Model<StripeTypes> =
  models.StripePay || model<StripeTypes>("StripePay", stripeSchema);

export default StripeModel;
