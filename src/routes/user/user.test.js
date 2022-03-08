import request from 'supertest';

import app from '../../app.js';
import { User } from '../../models/User.js';

const user1 = {
  name: 'Tom',
  email: 'tom@tom.com',
  password: 'mynicepass',
};

const user2 = {
  name: 'Tim',
  email: 'tim@tim.com',
  password: 'mynicepass',
};

const user3 = {
  name: 'xyz',
  email: 'xyz@xyz.com',
  password: 'mynicepass',
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(user2).save();
});

test('Should signup a new user', async () => {
  await request(app).post('/users').send(user1).expect(201);
});

test('Should login existing user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: user2.email,
      password: user2.password,
    })
    .expect(200);
});

test("Shouldn't login nonexisting user", async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: user3.email,
      password: user3.password,
    })
    .expect(400);
});
