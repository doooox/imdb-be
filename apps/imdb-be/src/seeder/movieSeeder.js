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

    const movies = [];
    for (let i = 0; i < 10; i++) {
      const movie = {
        title: faker.faker.name.fullName(),
        description: faker.faker.lorem.paragraphs(),
        coverImage: faker.faker.image.business(),
        genre: [],
      };
      const rundomNumber = Math.floor(Math.random() * genre.length);
      for (let i = 0; i < rundomNumber; i++) {
        const rundomNumber = Math.floor(Math.random() * genre.length);
        if (!movie.genre.includes(genre[rundomNumber])) {
          movie.genre.push(genre[rundomNumber]);
        }
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
