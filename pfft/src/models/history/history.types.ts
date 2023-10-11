import { Schema, Document } from "mongoose";
export interface IHistory extends Document  {
  headline: string;
  article: string;
  author:string;
  userId: Schema.Types.ObjectId;
}

export type HistoryDocument = IHistory & Document;