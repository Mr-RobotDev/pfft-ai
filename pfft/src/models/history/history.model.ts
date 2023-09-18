import { Model, model, models } from "mongoose";
import historySchema from "./history.schema";
import { IHistory } from "./history.types";

const HistoryModel: Model<IHistory> =
  models.History || model<IHistory>("History", historySchema);

export default HistoryModel;
