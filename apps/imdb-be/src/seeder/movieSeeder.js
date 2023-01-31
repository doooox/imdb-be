const MongoClient = require('mongodb').MongoClient;
const faker = require('@faker-js/faker');

(async () => {
  const url = 'mongodb://localhost/imdb';
  const client = new MongoClient(url, {});
  try {
    await client.connect();
    const collection = client.db().collection('movies');
    const genresCollection = client.db().collection('genres');
    const genre = await genresCollection.find({}).toArray();
    const commentsCollection = client.db().collection('comments');
    const comments = await commentsCollection.find({}).toArray();

    const movies = [];
    for (let i = 0; i < 100; i++) {
      const movie = {
        title: faker.faker.name.fullName(),
        description: faker.faker.lorem.paragraphs(),
        coverImage:
          'https://trailers.apple.com/trailers/paramount/dungeons-dragons-honor-among-thieves/images/poster_2x.jpg',
        genres: [],
        comments: [],
      };
      const rundomNumber = Math.floor(Math.random() * genre.length);
      for (let i = 0; i < rundomNumber; i++) {
        const rundomNumber = Math.floor(Math.random() * genre.length);
        if (!movie.genres.includes(genre[rundomNumber])) {
          movie.genres.push(genre[rundomNumber]);
        }
        movie.comments.push(comments[rundomNumber]);
      }
      movies.push(movie);
    }
    await collection.deleteMany();
    await collection.insertMany(movies);
    console.log(`${movies.length} movies seeded`);
    process.exit(0);
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  }
})();
