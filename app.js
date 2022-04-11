const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const userRouter = require('./routes/user');
const { notFoundHandler, commonError } = require('./middlewares/errorHandler');

app.use(cors());
app.use(express.json());

app.use('/user', userRouter);

// Error handler
app.use(notFoundHandler);
app.use(commonError);

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    app.listen(process.env.PORT);
    console.log('database connected!');
  })
  .catch(err => console.log(err.message));
