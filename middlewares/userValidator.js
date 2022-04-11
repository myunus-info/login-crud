const { check, validationResult } = require('express-validator');
const HttpError = require('../models/httpError');
const User = require('../models/user');

const addValidation = [
  check('name').trim().not().isEmpty(),
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email address!')
    .custom(async email => {
      let user;
      try {
        user = await User.findOne({ email });
      } catch (err) {
        const error = new HttpError(500, 'Could not find user!');
        return next(error);
      }
      if (user) {
        const error = new HttpError(422, 'The user already exists!');
        return next(error);
      }
    })
    .normalizeEmail(),
  check('password').trim().isLength({ min: 6 }),
];

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(422, 'Invalid data provided');
    return next(error);
  }
  next();
};

module.exports = {
  addValidation,
  validationHandler,
};
