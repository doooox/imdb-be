import { genSalt, hash } from 'bcryptjs';
import Auth from '../models/Auth/authModel';
import Genres from '../models/Movies/genreModel';
import * as request from 'supertest';
import { Cookie } from 'express-session';
import { IMovie } from '../types/Movies/moviesTypes';
import { faker } from '@faker-js/faker';

type IExampleUser = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
};

export const createTestUser = async (
  app: Express.Application,
  data: IExampleUser | undefined = undefined
) => {
  if (!data) {
    data = {
      email: faker.internet.email(),
      name: 'admin',
      password: 'admin123',
      confirmPassword: 'admin123',
    };
  }
  const salt = await genSalt(10);
  const hashedPassword = await hash(data.password, salt);
  await Auth.create({
    email: data.email,
    name: data.name,
    password: hashedPassword,
    isAdmin: true,
  });

  const response = await request(app).post('/api/auth/singin').send({
    email: data.email,
    password: data.password,
  });

  return response;
};

export const createTestMovie = async (
  app: Express.Application,
  data: IMovie,
  cookie: Cookie
) => {
  const testGenre = await Genres.create({
    name: 'TestGenre',
  });
  data.genres = [{ _id: testGenre._id }];

  const response = await request(app)
    .post('/api/movies/create')
    .set('Cookie', cookie ? cookie[0] : 'badcookie')
    .send(data);

  return response;
};

export const createTestComment = async (
  app: Express.Application,
  data: IMovie,
  commentData: { body: string }
) => {
  const userResponse = await createTestUser(app);
  const cookie = userResponse.headers['set-cookie'];

  const response = await createTestMovie(app, data, cookie);

  const respone1 = await request(app)
    .post(`/api/comments/create/${response.body._id}`)
    .send(commentData)
    .set('Cookie', cookie[0]);

  return respone1;
};
