import { createApp } from '../../app/app';
import * as request from 'supertest';
import mongoose from 'mongoose';
import { Cookie } from 'express-session';
import Movie from '../../models/Movies/movieModel';
import { createTestUser } from '../Auth/auth.spec';
import Genres from '../../models/Movies/genreModel';
import { IGenres, IMovie } from '../../types/Movies/moviesTypes';

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

const genresData = {
  name: 'genre 1',
};
let testGenre: IGenres | undefined = undefined;
let data: IMovie | undefined = undefined;

beforeEach(async () => {
  testGenre = await Genres.create(genresData);
  data = {
    _id: '123rfdsafd',
    title: 'Movie test',
    description: 'Description movie test',
    coverImage:
      'https://trailers.apple.com/trailers/paramount/dungeons-dragons-honor-among-thieves/images/poster_2x.jpg',
    genres: [
      {
        _id: testGenre._id,
        name: testGenre.name,
      },
    ],
  };
});

export const createMovie = async () => {
  const response = await request(app)
    .post('/api/movies/create')
    .set('Cookie', cookie[0])
    .send(data);

  return response;
};

describe('Get movies test', () => {
  it('Should return paginated movie list', async () => {
    await createMovie();
    const response = await request(app)
      .get('/api/movies/?page=1')
      .set('Cookie', cookie[0]);

    expect(response.body.data[0].title).toBe(data.title);
    expect(response.status).toBe(200);
  });

  it('Should return not auth', async () => {
    await createMovie();
    const response = await request(app).get('/api/movies');

    expect(response.body.errors[0].msg).toBe('User not authenticated!');
    expect(response.status).toBe(401);
  });
});
it('Should return filtered movies', async () => {
  await createMovie();
  const response = await request(app)
    .get('/api/movies/?page=1')
    .send({
      genres: [testGenre._id],
    })
    .set('Cookie', cookie[0]);

  for (let i = 0; i < response.body.data.length; i++) {
    const movie = response.body.data[i];
    const genres = movie.genres;
    const exists = genres.some((genre) => genre._id == testGenre._id);
    expect(exists).toBe(true);
  }
  expect(response.status).toBe(200);
});

describe('Create movie test', () => {
  it('Should return movie created', async () => {
    const response = await createMovie();

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
    const response = await request(app)
      .post('/api/movies/create')
      .set('Cookie', cookie[0])
      .send(data);

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
