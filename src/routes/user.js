import express from 'express';

import { User, userAllowedUpdates } from '../models/User.js';

export const userRouter = express.Router();

userRouter.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
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
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get('/users', async (_, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(404).send();
  }
});

userRouter.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send();

    res.status(200).send(user);
  } catch (err) {
    res.status(404).send(err);
  }
});

userRouter.patch('/users/:id', async (req, res) => {
  const requestedUpdates = Object.keys(req.body);
  const isUpdateAllowed = requestedUpdates.every((update) =>
    userAllowedUpdates.includes(update)
  );

  if (!isUpdateAllowed)
    return res.status(400).send({ error: 'Invalid updates requested' });

  try {
    const updatedUser = await User.findById(req.params.id);
    requestedUpdates.forEach(
      (updateKey) => (updatedUser[updateKey] = req.body[updateKey])
    );

    await updatedUser.save();

    if (!updatedUser) return res.status(404).send();

    res.status(201).send(updatedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

userRouter.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send();

    res.status(200).send(user);
  } catch (err) {
    res.status(404).send(err);
  }
});
