const HttpError = require('../models/httpError');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(500, 'Signup failed!');
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(422, 'Signup failed. User already exists!');
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(500, 'Signup failed!');
    return next(error);
  }

  const newUser = new User({ name, email, password: hashedPassword });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(500, 'Signing up user failed!');
    return next(error);
  }

  try {
    const token = await newUser.generateAuthToken();
    res.status(201).json({ userId: newUser._id, email, token });
  } catch (err) {
    const error = new HttpError(500, 'Could not sing up user. Please try again!');
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = user.generateAuthToken();
    res.status(200).json({ userId: user._id, token });
  } catch (err) {
    const error = new HttpError(422, 'Something went wrong!');
    return next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json({ users });
  } catch (err) {
    const error = new HttpError(500, 'Fetching users failed!');
    return next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json({ message: 'User fetched successfully!', user });
  } catch (err) {
    const error = new HttpError(500, 'Fetching user failed!');
    return next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  let user;
  try {
    user = await User.findById(req.params.userId);
  } catch (err) {
    const error = new HttpError(500, 'Could not update user info!');
    return next(error);
  }

  (user.name = name), (user.email = email), (user.password = password);

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(500, 'Updating user info failed!');
    return next(error);
  }

  res.status(200).json({ message: 'User updated successfully!', user });
};

exports.deleteUser = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.userId);
  } catch (err) {
    const error = new HttpError(500, 'Could not find user!');
    return next(error);
  }

  try {
    await user.remove();
  } catch (err) {
    const error = new HttpError(500, 'Removing user info failed!');
    return next(error);
  }

  res.status(200).json({ message: 'User removed successfully!' });
};
