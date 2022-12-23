const express = require('express');
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//// ---------------functions-------------------
const getAllTours = function (req, res) {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours: tours },
  });
};

const getSingleTour = function (req, res) {
  //1) getting the tour id
  const id = +req.params.id;
  //2) finding tour with that id
  const tour = tours.find((tour) => tour.id === id);
  //3) if tour exist then send it as a respond
  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
    return;
  }
  res.status(200).json({
    status: 'success',
    data: { tour: tour },
  });
};

const createTour = function (req, res) {
  //1) getting post data
  const postData = req.body;
  //2) create an ID for the new tour
  const newTourId = tours.length;
  //3) new object with data and newId
  const newTour = Object.assign(postData, { id: newTourId });
  //4) update the tours array
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      //201 means "updated"
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  );
};

const updateTour = function (req, res) {
  res.status(200).json({
    status: 'success',
    message: 'tour was updated',
  });
};
const deleteTour = function (req, res) {
  res.status(200).json({
    status: 'success',
    data: 'null',
  });
};

//// ---------------Mounting Routers-------------------
// 1- creating router
const toursRouter = express.Router();

// 2- for '/api/v1/tours'
toursRouter.route('/').get(getAllTours).post(createTour);
// 3- for '/api/v1/tours/:id'
toursRouter
  .route('/:id')
  .get(getSingleTour)
  .patch(updateTour)
  .delete(deleteTour);
//note that tourRouter will be active only on /api/v1/tours so we DONT write the http address inside route('')

module.exports = toursRouter;
