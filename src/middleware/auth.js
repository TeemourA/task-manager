import jwt from 'jsonwebtoken';
import { unauthorizedAccessErrorMessage } from '../constants/errorMessages.js';

import { User } from '../models/User.js';
import { authorization } from '../constants/headers.js';
import { secret } from '../constants/index.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header(authorization).replace('Bearer ', '');
    const { _id } = jwt.verify(token, secret);
    const user = await User.findOne({ _id, 'tokens.token': token });

    if (!user) throw new Error();

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: unauthorizedAccessErrorMessage });
  }
};
