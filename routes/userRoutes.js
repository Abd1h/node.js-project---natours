const express = require('express');
const usersController = require('../controllers/controlUsers');
const authController = require('../controllers/authController');
//<><><><><><><><><><><><><><><><><><><><><><><><><><>//
//mounting routers
const usersRouter = express.Router();
// 1- for '/api/v1/users'
usersRouter
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser);
// 2- for '/api/v1/users/:id'
usersRouter
  .route('/:id')
  .get(usersController.getSingleUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

//3- for '/api/v1/users/signup'
usersRouter.route('/signup').post(authController.signup);
usersRouter.route('/login').post(authController.login);
module.exports = usersRouter;
