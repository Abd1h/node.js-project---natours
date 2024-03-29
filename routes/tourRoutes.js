const express = require('express');
const toursController = require('../controllers/controlTours');
const authController = require('../controllers/authController');
//<><><><><><><><><><><><><><><><><><><><><><><><><><>//
//// Mounting Routers

// 1- creating router
const toursRouter = express.Router();

// 2- for '/api/v1/tours'
toursRouter
  .route('/')
  .get(authController.protect, toursController.getAllTours)
  .post(toursController.createTour);

//note top5Cheap is a middelware
toursRouter
  .route('/top-5-cheap')
  .get(toursController.top5Cheap, toursController.getAllTours);
// spical route 1
toursRouter.route('/tours-stats').get(toursController.getTourStats);
// spical route 2
toursRouter.route('/get-month-status/:year').get(toursController.getYearStatus);

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
