import { Schema, Document } from "mongoose";
export interface IHistory extends Document  {
  headline: string;
  article: string;
  author:string;
  userId: Schema.Types.ObjectId;
  opinion: string;
}

export type HistoryDocument = IHistory & Document;