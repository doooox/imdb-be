import { createApp } from '../../app/app';
import * as request from 'supertest';
import mongoose from 'mongoose';
import { Cookie } from 'express-session';
import { createTestUser } from '../Auth/auth.spec';
import { createMovie } from '../Movies/movies.spec';

const app = createApp();

let cookie: Cookie | undefined;

afterEach(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
});
beforeAll(async () => {
  await createTestUser();
  const data = { email: 'admin@admin.com', password: 'admin123' };
  const response = await request(app).post('/api/auth/singin').send(data);
  cookie = response.headers['set-cookie'];
});

const commentData = {
  body: 'Comment test',
};
export const createComment = async () => {
  const respones = await createMovie();

  const respone1 = await request(app)
    .post(`/api/comments/create/${respones.body._id}`)
    .send(commentData)
    .set('Cookie', cookie[0]);

  return respone1;
};

describe('Get comments test', () => {
  it('Should return movie comments', async () => {
    const response = await createComment();
    const respone1 = await request(app).get(`/api/comments/${response.body.movieId}/?page=1`).set("Cookie", cookie[0])


    expect(respone1.body.data[0].body).toBe(commentData.body);
    expect(response.status).toBe(201);
  });


  it('Should return comment created', async () => {
    const response = await createComment();

    expect(response.body.body).toBe(commentData.body);
    expect(response.status).toBe(201);
  });

  it("Should return comment body required", async () => {
    const data = { body: "" }
    const response = await request(app).post("/api/comments/create/movieId").set("Cookie", cookie[0]).send(data)

    expect(response.body.errors[0].msg).toBe("Comment body is required")
    expect(response.status).toBe(400)
  })
});
