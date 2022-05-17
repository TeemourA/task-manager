import request from 'supertest';
import app from '../../app';
import { Task } from '../../models/Task';
import {
  user1,
  user2,
  user2Id,
  user3,
  user4,
  user4Id,
  task1,
  task2,
  task3,
  setupTestDatabase,
} from '../../tests/fixtures/db';

import { authorization } from '../../constants/headers.js';

beforeEach(setupTestDatabase);

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set(authorization, `Bearer ${user2.tokens[0].token}`)
    .send({
      description: 'Test task from test',
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test('Should fetch user tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .set(authorization, `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});

test('Should not delete other users task', async () => {
  await request(app)
    .delete(`/tasks/${task1._id}`)
    .set(authorization, `Bearer ${user4.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(task1._id);
  expect(task).not.toBeNull();
});

test('Should not create task without description', async () => {
  await request(app)
    .post('/tasks')
    .set(authorization, `Bearer ${user4.tokens[0].token}`)
    .send()
    .expect(400);
});

test('Should not create task with invalid completion', async () => {
  await request(app)
    .post('/tasks')
    .set(authorization, `Bearer ${user4.tokens[0].token}`)
    .send({ completed: 'stringValue' })
    .expect(400);
});

test('Should update task fro authorized user', async () => {
  const response = await request(app)
    .patch(`/tasks/${task1._id}`)
    .set(authorization, `Bearer ${user2.tokens[0].token}`)
    .send({ description: 'edited task', completed: true })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task._id).toEqual(task1._id);
  expect(task.description).toEqual('edited task');
  expect(task.completed).toEqual(true);
});
