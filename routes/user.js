const express = require('express');
const {
  signup,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/user');

const { addValidation, validationHandler } = require('../middlewares/userValidator');
const isAuth = require('../middlewares/isAuth');
const router = express.Router();

router.post('/signup', addValidation, validationHandler, signup);

router.post('/login', login);

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.put('/users/:userId', isAuth, addValidation, validationHandler, updateUser);

router.delete('/users/:userId', isAuth, deleteUser);

module.exports = router;
