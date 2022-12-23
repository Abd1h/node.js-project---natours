const express = require('express');
const fs = require('fs');

//downloading sync since we need to download it once
//if we did this inside a route function it will enter the "event loop" and slow our app
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//---------------user functions------------------
const getAllUsers = function (req, res) {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours: tours },
  });
};

const getSingleUser = function (req, res) {
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

const createUser = function (req, res) {
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

const updateUser = function (req, res) {
  res.status(200).json({
    status: 'success',
    message: 'tour was updated',
  });
};
const deleteUser = function (req, res) {
  res.status(200).json({
    status: 'success',
    data: 'null',
  });
};

//---------------mounting routers------------------
const usersRouter = express.Router();
// 1- for '/api/v1/users'
usersRouter.route('/').get(getAllUsers).post(createUser);
// 2- for '/api/v1/users/:id'
usersRouter
  .route('/:id')
  .get(getSingleUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = usersRouter;
