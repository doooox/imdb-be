import mongooses from 'mongoose';

const connectDB = async () => {
  const dbName = process.env.NX_MONGO_URI;
  // console.log(dbName);

  try {
    await mongooses.connect(dbName);
    // console.log(`MongoDB connected ${dbName}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
