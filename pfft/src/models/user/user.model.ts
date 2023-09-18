import { Model,model, models} from 'mongoose';
import {IUser, IUserSchema} from './user.types';
import UserSchema from '@models/user/user.schema';

const UserModel:Model<IUserSchema |IUser> = models.user || model<IUserSchema | IUser>('user', UserSchema);

export default UserModel;
