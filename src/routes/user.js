import express from 'express';
import multer from 'multer';

import { auth } from '../middleware/auth.js';
import { User, userAllowedUpdates } from '../models/User.js';

import { imageExtensionsRegex } from '../constants/regex.js';
import { avatarImageSizeLimit } from '../constants/fileSizeLimit.js';

export const userRouter = express.Router();

userRouter.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

userRouter.post('/users/login', async (req, res) => {
  try {
    // @ts-ignore
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.post('/users/logout', auth, async (req, res) => {
  try {
    // @ts-ignore
    req.user.tokens = req.user.tokens.filter(
      // @ts-ignore
      ({ token }) => token !== req.token
    );
    // @ts-ignore
    await req.user.save();

    res.status(200).send();
  } catch (err) {
    res.status(500).send();
  }
});

userRouter.post('/users/logoutAll', auth, async (req, res) => {
  try {
    // @ts-ignore
    req.user.tokens = [];
    // @ts-ignore
    await req.user.save();

    res.status(200).send();
  } catch (err) {
    res.status(500).send();
  }
});

userRouter.get('/users/me', auth, async (req, res) => {
  // @ts-ignore
  res.status(200).send(req.user);
});

userRouter.patch('/users/me', auth, async (req, res) => {
  const requestedUpdates = Object.keys(req.body);
  const isUpdateAllowed = requestedUpdates.every((update) =>
    userAllowedUpdates.includes(update)
  );

  if (!isUpdateAllowed)
    return res.status(400).send({ error: 'Invalid updates requested' });

  try {
    // @ts-ignore
    const updatedUser = req.user;
    requestedUpdates.forEach(
      (updateKey) => (updatedUser[updateKey] = req.body[updateKey])
    );

    await updatedUser.save();

    res.status(201).send(updatedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

userRouter.delete('/users/me', auth, async (req, res) => {
  try {
    // @ts-ignore
    await req.user.remove();
    // @ts-ignore
    res.status(200).send(req.user);
  } catch (err) {
    res.status(404).send(err);
  }
});

const uploadAvatar = multer({
  dest: 'avatars',
  limits: {
    fileSize: avatarImageSizeLimit,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(imageExtensionsRegex))
      return callback(new Error('Please upload an image'));

    callback(null, true);
  },
});

userRouter.post(
  '/users/me/avatar',
  uploadAvatar.single('avatar'),
  (req, res) => {
    res.status(200).send();
  }
);
