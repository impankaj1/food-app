import mongoose from 'mongoose';

const mongo_url = process.env.MONGODB_URL!;

mongoose
  .connect(mongo_url)
  .then(() => {
    console.log('Mongoose Connected');
  })
  .catch((e) => {
    console.log('connection error', e);
  });
