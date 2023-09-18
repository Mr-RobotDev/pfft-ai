import { Document } from "mongoose";

export interface IStripe extends Document {
  link: String;
  uid: String;
  shortUrl: String;
  createdAt: Date;
}
export type StripeDocument = IStripe & Document;
