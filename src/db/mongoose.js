import mongoose from 'mongoose';

export const dbConnect = () => mongoose.connect(process.env.MONGODB_URL);

dbConnect();
