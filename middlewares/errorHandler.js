const HttpError = require('../models/httpError');

// Not found handler
exports.notFoundHandler = (req, res, next) => {
  const error = new HttpError(404, 'Your requested content was not found!');
  return next(error);
};

// common error Handler

exports.commonError = (error, req, res, next) => {
  res.status(error.code || 500).json({ message: error.message });
};
