import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { User } from '../../models/User';
import { Task } from '../../models/Task';

export const user1 = {
  name: 'Tom',
  email: 'tom@tom.com',
  password: 'mynicepass',
};

export const user2Id = new mongoose.Types.ObjectId();
export const user2 = {
  _id: user2Id,
  name: 'Tim',
  email: 'tim@tim.com',
  password: 'mynicepass',
  tokens: [
    {
      token: jwt.sign({ _id: user2Id }, process.env.TOKEN_SECRET),
    },
  ],
};

export const user3 = {
  name: 'xyz',
  email: 'xyz@xyz.com',
  password: 'mynicepass',
};

export const user4Id = new mongoose.Types.ObjectId();
export const user4 = {
  _id: user4Id,
  name: 'John Dutton',
  email: 'j@d.com',
  password: 'ranch333',
  tokens: [
    {
      token: jwt.sign({ _id: user4Id }, process.env.TOKEN_SECRET),
    },
  ],
};

export const task1 = {
  _id: new mongoose.Types.ObjectId(),
  description: 'task one',
  completed: false,
  owner: user2._id,
};

export const task2 = {
  _id: new mongoose.Types.ObjectId(),
  description: 'task two',
  completed: true,
  owner: user2._id,
};

export const task3 = {
  _id: new mongoose.Types.ObjectId(),
  description: 'task three',
  completed: true,
  owner: user4._id,
};

export const setupTestDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();

  await new User(user2).save();
  await new User(user4).save();

  await new Task(task1).save();
  await new Task(task2).save();
  await new Task(task3).save();
};
