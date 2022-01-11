import mongoose from 'mongoose';

const { Schema } = mongoose;

const TaskSchema = new Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

export const Task = mongoose.model('Task', TaskSchema);

export const taskAllowedUpdates = ['description', 'completed'];
