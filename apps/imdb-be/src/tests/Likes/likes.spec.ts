import { createApp } from '../../app/app';
import * as request from 'supertest';
import mongoose from 'mongoose';
import { createTestMovie, createTestUser } from '../../utils/test-helpers';
import { IMovie } from '../../types/Movies/moviesTypes';
import { Cookie } from 'express-session';
import Genres from '../../models/Movies/genreModel';
import Movie from '../../models/Movies/movieModel';
import { ILike } from '../../types/Movies/likes.types';

const app = createApp();

const data: IMovie = {
  _id: '',
  title: 'Movie test',
  description: 'Description movie test',
  coverImage:
    'https://trailers.apple.com/trailers/paramount/dungeons-dragons-honor-among-thieves/images/poster_2x.jpg',
  genres: [],
  views: 0,
  likes: []
};



afterEach(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
});

describe('Likes test', () => {
  it('Should return movie likes', async () => {
    const userResponse = await createTestUser(app)
    const cookie: Cookie = userResponse.headers['set-cookie'];
    const movieRespones = await createTestMovie(app, data, cookie)

    const response = await request(app).put(`/api/movies/likes/${movieRespones.body._id}`).send({
      state: "like"
    }).set("Cookie", cookie[0])

    expect(response.body.likeData.state).toBe("like")
    expect(response.body.likeData.totalLikes).toBe(1)
    expect(response.body.likeData.totalDislikes).toBe(0)
    expect(JSON.stringify(response.body.movie._id)).toStrictEqual(JSON.stringify(movieRespones.body._id))
  });

  it('Should return movie likes', async () => {
    const userResponse = await createTestUser(app)
    const cookie: Cookie = userResponse.headers['set-cookie'];
    const movieRespones = await createTestMovie(app, data, cookie)

    const response = await request(app).put(`/api/movies/likes/${movieRespones.body._id}`).send({
      state: "like"
    }).set("Cookie", cookie[0])

    expect(response.body.likeData.state).toBe("like")
    expect(response.body.likeData.totalLikes).toBe(1)
    expect(response.body.likeData.totalDislikes).toBe(0)
    expect(JSON.stringify(response.body.movie._id)).toStrictEqual(JSON.stringify(movieRespones.body._id))

    const response1 = await request(app).get("/api/movies/?page=1").set("Cookie", cookie[0])

    expect(response1.body.data[0].likeData.state).toBe("like")
    expect(response1.body.data[0].likeData.totalLikes).toBe(1)
    expect(response1.body.data[0].likeData.totalDislikes).toBe(0)
  });



});
