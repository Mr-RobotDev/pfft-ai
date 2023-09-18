import { Model, model, models } from "mongoose";
import shortURLSchema from "./short.schema";
import { IStripe } from "./short.types";

const ShortModel: Model<IStripe> =
  models.shortURL || model<IStripe>("shortURL", shortURLSchema);

export default ShortModel;
