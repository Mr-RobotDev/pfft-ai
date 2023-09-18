import { Model, model, models } from "mongoose";
import { IPaymentRecord } from "./paymentRecord.types";
import paymentRecordSchema from "./paymentRecord.schema";

const PaymentRecord: Model<IPaymentRecord> =
  models.PaymentRecord ||
  model<IPaymentRecord>("PaymentRecord", paymentRecordSchema);

export default PaymentRecord;
