import mongoose from 'mongoose';

export const dbConnect = () =>
  mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/task-manager-api'
  );

dbConnect();
