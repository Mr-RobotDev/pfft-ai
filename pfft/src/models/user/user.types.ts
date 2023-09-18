import type { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  userType: string;
}

export interface IUserSchema extends Document {
  email: {
    type: string;
    required: boolean;
    unique: [boolean, string];
    validate: [validator: (value: string) => boolean, message: string];
  };
  userType: {
    type: string;
    required: boolean;
  };
  password: string;
  username: {
    type: string;
    required: boolean;
    unique: [boolean, string];
  };
}

export interface IUserDocument extends IUser{}
// export interface IUserModel extends Model<IUserDocument> {}

export interface Credentials {
  email: string;
  username: string;
  password: string;
}
