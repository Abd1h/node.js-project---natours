const express = require('express');
const usersController = require('../controllers/controlUsers');
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

module.exports = usersRouter;
