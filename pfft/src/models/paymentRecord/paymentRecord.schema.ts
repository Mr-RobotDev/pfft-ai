import { Schema } from "mongoose";

const paymentRecordSchema: Schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isFreeCredit: {
    type: Boolean,
    required: true,
  },
  credit: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
});
export default paymentRecordSchema;
