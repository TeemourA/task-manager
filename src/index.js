import express, { request } from 'express';
import bcrypt from 'bcryptjs';

import { dbConnect } from './db/mongoose.js';
import { userRouter } from './routes/user.js';
import { taskRouter } from './routes/task.js';

dbConnect();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use([userRouter, taskRouter]);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

// const func = async () => {
//   const pass = 'Red12345!';
//   const hashedPass = await bcrypt.hash(pass, bcrypt.genSaltSync(8));
//   const isMatch = await bcrypt.compare(pass, hashedPass);
//   console.log(pass);
//   console.log(hashedPass);
//   console.log(isMatch);

//   return hashedPass;
// };

// func();
