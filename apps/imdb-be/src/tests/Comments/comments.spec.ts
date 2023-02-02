import { createApp } from '../../app/app';
import * as request from 'supertest';
import mongoose from 'mongoose';
import { createTestComment, createTestUser } from '../../utils/test-helpers';
import { IMovie } from '../../types/Movies/moviesTypes';
//
const app = createApp();

const data: IMovie = {
  _id: 'asdasd',
  title: 'Movie test',
  description: 'Description movie test',
  coverImage:
    'https://trailers.apple.com/trailers/paramount/dungeons-dragons-honor-among-thieves/images/poster_2x.jpg',
  genres: [],
  views: 0
};

afterEach(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
});

const commentData = { body: 'Comment test' };

describe('Get comments test', () => {
  it('Should return movie comments', async () => {
    const response = await createTestComment(app, data, commentData);
    const userResponse = await createTestUser(app);
    const respone1 = await request(app)
      .get(`/api/comments/${response.body.movieId}/?page=1`)
      .set('Cookie', userResponse.headers['set-cookie'][0]);

    expect(respone1.body.data[0].body).toBe(commentData.body);
    expect(response.status).toBe(201);
  });

  it('Should return comment created', async () => {
    const response = await createTestComment(app, data, commentData);

    expect(response.body.body).toBe(commentData.body);
    expect(response.status).toBe(201);
  });

  it('Should return comment body required', async () => {
    const userResponse = await createTestUser(app);
    const data = { body: '' };
    const response = await request(app)
      .post('/api/comments/create/movieId')
      .set('Cookie', userResponse.headers['set-cookie'][0])
      .send(data);

    expect(response.body.errors[0].msg).toBe('Comment body is required');
    expect(response.status).toBe(400);
  });
});
