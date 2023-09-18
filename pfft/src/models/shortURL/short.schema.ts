import { Schema } from "mongoose";

const shortURLSchema = new Schema({
  link: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
});

export default shortURLSchema;
