import express from 'express';

import { dbConnect } from './db/mongoose.js';
import { userRouter } from './routes/user.js';
import { taskRouter } from './routes/task.js';

dbConnect();

const app = express();
const port = process.env.PORT || 3000;

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  next();
});
app.use(express.json());
app.use([userRouter, taskRouter]);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
