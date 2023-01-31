const MongoClient = require('mongodb').MongoClient;
const faker = require('@faker-js/faker');

(async () => {
  const url = 'mongodb://localhost/imdb';
  const client = new MongoClient(url, {});
  try {
    await client.connect();
    const collection = client.db().collection('comments');

    const comments = [];
    for (let i = 0; i < 20; i++) {
      const comment = {
        body: faker.faker.lorem.paragraph(),
      };
      comments.push(comment);
    }

    await collection.deleteMany();
    await collection.insertMany(comments);
    console.log(`${comments.length} comments seeded`);
    process.exit(0);
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  }
})();
