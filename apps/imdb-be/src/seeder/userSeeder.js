const MongoClient = require('mongodb').MongoClient;
const faker = require('@faker-js/faker');
const bcryptjs = require('bcryptjs');

(async () => {
  const url = 'mongodb://localhost/imdb';
  const client = new MongoClient(url, {});
  try {
    await client.connect();
    const collection = client.db().collection('users');
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('admin123', salt);
    const data = {
      email: 'admin@admin.com',
      name: 'Admin',
      password: hashedPassword,
      isAdmin: true,
    };
    const data2 = {
      email: 'admin1@admin.com',
      name: 'Admin',
      password: hashedPassword,
      isAdmin: true,
    };
    const users = [];
    for (let i = 0; i < 10; i++) {
      const user = {
        email: faker.faker.internet.email(),
        name: faker.faker.name.fullName(),
        password: hashedPassword,
        isAdmin: false,
      };
      users.push(user);
    }
    users.push(data);
    users.push(data2);
    await collection.deleteMany();
    await collection.insertMany(users);
    console.log(`${users.length} users seeded`);
    process.exit(0);
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  }
})();
