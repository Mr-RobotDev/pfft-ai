import { Schema, Document } from "mongoose";
export interface StripeTypes extends Document {
  user_id: Schema.Types.ObjectId;
  customer_id: string;
  transaction_id: string;
  type: string;
  date: Date;
  orderNo: number;
  expiry: Date;
  amount: number;
  credit: number;
  subscriptionId: string;
}
export type HistoryDocument = StripeTypes & Document;
