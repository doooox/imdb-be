import { createApp } from '../../app/app';
import * as request from 'supertest';
import mongoose from 'mongoose';
import { createTestMovie, createTestUser } from '../../utils/test-helpers';
import { IMovie } from '../../types/Movies/moviesTypes';
import { Cookie } from 'express-session';
import Genres from '../../models/Movies/genreModel';
import Movie from '../../models/Movies/movieModel';

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

describe('Get movies test', () => {
  it('Should return paginated movie list', async () => {
    const userResponse = await createTestUser(app);
    const cookie: Cookie = userResponse.headers['set-cookie'];

    await createTestMovie(app, data, cookie);

    const response = await request(app)
      .get('/api/movies/?page=1')
      .set('Cookie', cookie[0]);

    expect(response.body.data[0].title).toBe(data.title);
    expect(response.status).toBe(200);
  });

  it('Should return single movie', async () => {
    const userResponse = await createTestUser(app);
    const cookie: Cookie = userResponse.headers['set-cookie'];

    const movieRespones = await createTestMovie(app, data, cookie);


    const response = await request(app)
      .get(`/api/movies/${movieRespones.body._id}`)
      .set('Cookie', cookie[0]);

    expect(response.body.title).toBe(data.title);
    expect(response.body.views).toBe(1)
    expect(response.status).toBe(200);
  });
  it('Should return not auth', async () => {
    await createTestMovie(app, data, undefined);

    const response = await request(app).get('/api/movies');
    expect(response.body.errors[0].msg).toBe('User not authenticated!');
    expect(response.status).toBe(401);
  });

  it('Should return filtered movies', async () => {
    const userResponse = await createTestUser(app);
    const cookie: Cookie = userResponse.headers['set-cookie'];

    await createTestMovie(app, data, cookie);
    const dbGenre = await Genres.findOne({ name: 'TestGenre' }); // This is created in helpers when movie is created!
    const response = await request(app)
      .get('/api/movies/?page=1')
      .query(
        {
          genres: [{
            _id: dbGenre._id
          }]
        }
      )
      .set('Cookie', userResponse.headers['set-cookie'][0]);



    for (let i = 0; i < response.body.data.length; i++) {
      const movie = response.body.data[i];
      const genres = movie.genres;
      const exists = genres.some((genre) => genre._id == dbGenre._id);
      expect(exists).toBe(true);
    }
    expect(response.status).toBe(200);
  });

  it('Should return movie created', async () => {
    const userResponse = await createTestUser(app);
    const cookie: Cookie = userResponse.headers['set-cookie'];

    const response = await createTestMovie(app, data, cookie);

    expect(response.body.title).toBe(data.title);
    expect(response.body.description).toBe(data.description);
    expect(response.body.coverImage).toBe(data.coverImage);
    expect(JSON.stringify(response.body.genres[0]._id)).toStrictEqual(
      JSON.stringify(data.genres[0]._id)
    );
    expect(response.status).toBe(201);

    const dbRecord = await Movie.exists({ title: data.title });
    expect(dbRecord).toHaveProperty('_id');
  });

  it('Should return user not authenticated', async () => {
    const response = await request(app).post('/api/movies/create').send(data);

    expect(response.body.errors[0].msg).toBe('User not authenticated!');
    expect(response.status).toBe(401);
  });

  it('Should return title field is required', async () => {
    const userResponse = await createTestUser(app);
    const cookie: Cookie = userResponse.headers['set-cookie'];
    const data = {
      title: '',
      description: 'Description movie test',
      coverImage: 'coverImage movie test',
      genre: [{ name: 'Action' }, { name: 'Comedy' }],
    };
    const response = await request(app)
      .post('/api/movies/create')
      .set('Cookie', cookie[0])
      .send(data);

    expect(response.body.errors[0].msg).toBe('Title field is required');
    expect(response.status).toBe(400);
  });

  it('Should return movie already exists', async () => {
    const userResponse = await createTestUser(app);
    const cookie: Cookie = userResponse.headers['set-cookie'];

    const response = await createTestMovie(app, data, cookie);

    expect(response.body.title).toBe(data.title);
    expect(response.body.description).toBe(data.description);
    expect(response.body.coverImage).toBe(data.coverImage);
    expect(JSON.stringify(response.body.genres[0]._id)).toStrictEqual(
      JSON.stringify(data.genres[0]._id)
    );
    expect(response.status).toBe(201);

    const response1 = await request(app)
      .post('/api/movies/create')
      .set('Cookie', cookie[0])
      .send(data);

    expect(response1.body.errors[0].msg).toBe('Movie already exists');
    expect(response1.status).toBe(403);
  });
});
