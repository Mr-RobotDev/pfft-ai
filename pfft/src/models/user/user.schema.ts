import { Schema } from 'mongoose';
import validator from 'validator';

import { comparePassword } from '@models/user/user.methods';
import { findOneOrCreate } from '@models/user/user.static';
import type { IUserSchema } from '@models/user/user.types';
import bcrypt from 'bcryptjs';


const userSchema = new Schema<IUserSchema>({

  email: {
    type: String,
    required: false,
    // unique: [true, 'Account already exists'],
    unique: [true, 'Account already exists'],
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  userType: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [6, 'Your password must be at least 6 characters long'],
    select: false,
  },

  verificationToken: {
    type: String,
    required: false
  },

  isVerified: {
    type: Boolean,
    required: false
  }

});

userSchema.statics.findOneOrCreate = findOneOrCreate;
userSchema.methods.comparePassword = comparePassword;

// middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default userSchema;

