import { Schema, Document } from "mongoose";
export interface IPaymentRecord extends Document {
  user_id: Schema.Types.ObjectId;
  isFreeCredit: boolean;
  credit: number;
  email: string;
}
// export type PaymentRecordDocument = IPaymentRecord & Document;
