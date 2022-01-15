import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { secret } from '../constants/index.js';
import { appSalt } from '../constants/crypt.js';
import { loginErrorMessage } from '../constants/errorMessages.js';

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
    unique: true,
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userWithoutSensetiveData = user.toObject();

  delete userWithoutSensetiveData.password;
  delete userWithoutSensetiveData.tokens;

  return userWithoutSensetiveData;
};

UserSchema.methods.generateAuthToken = async function () {
  // User instance
  const user = this;
  // @ts-ignore
  const token = jwt.sign({ _id: user._id.toString() }, secret);

  user.tokens = user.tokens.concat({ token });
  // @ts-ignore
  await user.save();

  return token;
};

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error(loginErrorMessage);

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) throw new Error(loginErrorMessage);

  return user;
};

// Hash the plain text password before saving
UserSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, appSalt);
  }

  next();
});

export const User = mongoose.model('User', UserSchema);

export const userAllowedUpdates = ['name', 'email', 'password', 'age'];
