import express, { json } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
dotenv.config();
const app = express();

//allow json data as an input
app.use(json());
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://zantestate.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

const PORT = process.env.SERVER;
const MONGODB_URL = process.env.MONGODB_URL;

// mongodb connection
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('Connected to mongoDB successfully');
  })
  .catch((err) => console.log(err));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);

//Error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.log(err.message);
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
//app is listening on port 5000
app.listen(PORT, () => {
  console.log(`Server is runnung on port http://localhost:${PORT}`);
});
