import express from 'express';

import { dbConnect } from './db/mongoose.js';
import { userRouter } from './routes/user/user.js';
import { taskRouter } from './routes/task/task.js';
import { allowCors } from './middleware/allowCors.js';

dbConnect();

const app = express();

app.use(allowCors);
app.use(express.json());
app.use([userRouter, taskRouter]);

export default app;