import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import { appSalt } from '../constants/crypt.js';

const { Schema } = mongoose;
const { isEmail } = validator;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(email) {
      if (!isEmail(email)) throw new Error(`Email ${email} is not valid`);
    },
  },
  password: {
    type: String,
    minlength: 7,
    required: true,
    trim: true,
    validate(password) {
      if (password.toLowerCase().includes('password'))
        throw new Error('Password should not contain word "password"');
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(age) {
      if (age < 0) throw new Error('Age must be a positive number');
    },
  },
});

UserSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, appSalt);
  }

  next();
});

export const User = mongoose.model('User', UserSchema);

export const userAllowedUpdates = ['name', 'email', 'password', 'age'];
