
import { Schema } from 'mongoose';
import mongoose from 'mongoose';

 const stripeSchema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  customer_id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  transaction_id: {
    type: String,
    required: true,
  },
  date:{
    type:Date,
    required:true,
  },
  orderNo:{
    type:Number,
    required:true,
  },
  expiry:{
    type:Date,
    required:true,
  },
  amount:{
    type:Number,
    required:true,
  },
  credit:{
    type:Number,
    required:true,
  },
});

export default stripeSchema;

