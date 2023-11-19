
import { Schema } from 'mongoose';
import mongoose from 'mongoose';

 const historySchema = new Schema({
  article: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  headline: {
    type: String,
    required: true,
  },
  opinion: {
    type: String,
    required: false,
  },
});

export default historySchema;

