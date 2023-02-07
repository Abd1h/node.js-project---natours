const express = require('express');
const toursController = require('../controllers/controlTours');
//<><><><><><><><><><><><><><><><><><><><><><><><><><>//
//// Mounting Routers

// 1- creating router
const toursRouter = express.Router();

// 2- for '/api/v1/tours'
toursRouter
  .route('/')
  .get(toursController.getAllTours)
  .post(toursController.createTour);

// 3- for '/api/v1/tours/:id'
// // checking if ID is valid using param middlware
// toursRouter.param('id', toursController.checkID);
toursRouter
  .route('/:id')
  .get(toursController.getSingleTour)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTour);
//note that tourRouter will be active only on /api/v1/tours so we DONT write the http address inside route('')

module.exports = toursRouter;
