import mongoose from 'mongoose';

const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: { currentTime: () => new Date() },
  }
);

export const Task = mongoose.model('Task', TaskSchema);

export const taskAllowedUpdates = ['description', 'completed'];
