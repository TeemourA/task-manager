import express from 'express';

import { Task, taskAllowedUpdates } from '../models/Task.js';

export const taskRouter = express.Router();

taskRouter.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

taskRouter.get('/tasks', async (_, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (err) {
    res.status(404).send();
  }
});

taskRouter.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send();

    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

taskRouter.patch('/tasks/:id', async (req, res) => {
  const requestedUpdates = Object.keys(req.body);
  const isUpdateAllowed = requestedUpdates.every((update) =>
    taskAllowedUpdates.includes(update)
  );

  if (!isUpdateAllowed)
    return res.status(400).send({ error: 'Invalid updates requested' });

  try {
    const updatedTask = await Task.findById(req.params.id);
    requestedUpdates.forEach(
      (updateKey) => (updatedTask[updateKey] = req.body[updateKey])
    );

    await updatedTask.save();
    
    if (!updatedTask) return res.status(404).send();

    res.status(201).send(updatedTask);
  } catch (err) {
    res.status(400).send(err);
  }
});

taskRouter.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndRemove(req.params.id);
    if (!task) return res.status(404).send();

    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});