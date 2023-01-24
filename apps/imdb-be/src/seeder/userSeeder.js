const MongoClient = require('mongodb').MongoClient;
const faker = require('@faker-js/faker');
const bcryptjs = require('bcryptjs');

(async () => {
  const url = 'mongodb://localhost/imdb';
  const client = new MongoClient(url, {});
  try {
    await client.connect();
    const collection = client.db().collection('auths');
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('123456', salt);
    const data = {
      email: 'test@mail.com',
      name: 'test',
      password: hashedPassword,
    };
    const users = [];
    for (let i = 0; i < 10; i++) {
      const user = {
        email: faker.faker.internet.email(),
        name: faker.faker.name.fullName(),
        password: hashedPassword,
      };
      users.push(user);
    }
    users.push(data);
    await collection.deleteMany();
    await collection.insertMany(users);
    console.log(`${users.length} users seeded`);
    process.exit(0);
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  }
})();
