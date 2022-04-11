const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const HttpError = require('./httpError');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.findByCredentials = async function (email, password) {
  let existingUser;
  try {
    existingUser = await this.findOne({ email });
  } catch (err) {
    const error = new HttpError(500, 'Could not log in user!');
  }

  if (!existingUser) {
    const error = new HttpError(401, 'Invalid credentials');
    return next(error);
  }

  let isMatch;
  try {
    isMatch = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(500, 'Logging in failed!');
    return error;
  }

  if (!isMatch) {
    const error = new HttpError(422, 'Invalid credentials');
    return next(error);
  }

  return existingUser;
};

userSchema.methods.generateAuthToken = function () {
  let token;
  try {
    token = jwt.sign({ userId: this._id, email: this.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  } catch (err) {
    const error = new HttpError(500, 'Signing up user failed!');
    return next(error);
  }

  return token;
};

module.exports = mongoose.model('User', userSchema);
