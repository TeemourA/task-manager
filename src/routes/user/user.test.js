import request from 'supertest';

import app from '../../app.js';
import { User } from '../../models/User.js';

import {
  user1,
  user2,
  user2Id,
  user3,
  setupTestDatabase,
} from '../../tests/fixtures/db';
import { authorization } from '../../constants/headers.js';

const { PROFILE_PIC_PATH } = process.env;

beforeEach(setupTestDatabase);

test('Should signup a new user', async () => {
  const res = await request(app).post('/users').send(user1).expect(201);

  // Assert that the new user was added correctly
  const user = await User.findById(res.body.user._id);
  expect(user).not.toBe(null);

  // Assertions about the res
  expect(res.body).toMatchObject({
    user: {
      name: user1.name,
      email: user1.email,
    },
    token: user.tokens[0].token,
  });

  // Assert that the user password is not a plain text
  expect(user.password).not.toBe(user1.password);
});

test('Should login existing user', async () => {
  const res = await request(app)
    .post('/users/login')
    .send({
      email: user2.email,
      password: user2.password,
    })
    .expect(200);

  // Assert that the new token was added to the user's token list
  const user = await User.findById(res.body.user._id);
  expect(user.tokens[user.tokens.length - 1].token).toBe(res.body.token);
});

test('Should not login nonexisting user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: user3.email,
      password: user3.password,
    })
    .expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set(authorization, `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app).get('/users/me').send().expect(401);
});

test('Should delete profile for authenticated user', async () => {
  const res = await request(app)
    .delete('/users/me')
    .set(authorization, `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(200);

  // Assert that the user is succesfully deleted from database
  const user = await User.findById(res.body._id);
  expect(user).toBeNull();
});

test('Should not delete profile for unauthenticated user', async () => {
  await request(app).get('/users/me').send().expect(401);
});

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set(authorization, `Bearer ${user2.tokens[0].token}`)
    .attach('avatar', PROFILE_PIC_PATH)
    .expect(200);

  const user = await User.findById(user2Id);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set(authorization, `Bearer ${user2.tokens[0].token}`)
    .send({ name: 'John' })
    .expect(201);

  const user = await User.findById(user2Id);
  expect(user.name).toBe('John');
});

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set(authorization, `Bearer ${user2.tokens[0].token}`)
    .send({ addres: 'Moscow' })
    .expect(400);
});
