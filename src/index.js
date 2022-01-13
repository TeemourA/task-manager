import express from 'express';

import { dbConnect } from './db/mongoose.js';
import { userRouter } from './routes/user.js';
import { taskRouter } from './routes/task.js';
import { allowCors } from './middleware/allowCors.js';

dbConnect();

const app = express();
const port = process.env.PORT || 3000;

app.use(allowCors);
app.use(express.json());
app.use([userRouter, taskRouter]);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
