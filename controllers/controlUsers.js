const fs = require('fs');
const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');
//<><><><><><><><><><><><><><><><><><><><><><><><><><>//

//downloading sync since we need to download it once
//if we did this inside a route function it will enter the "event loop" and slow our app
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//user functions
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

exports.getSingleUser = function (req, res) {
  //1) getting the tour id
  const id = +req.params.id;
  //2) finding tour with that id
  const tour = tours.find((tour2) => tour2.id === id);
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

exports.createUser = function (req, res) {
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
    () => {
      //201 means "updated"
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  );
};

exports.updateUser = function (req, res) {
  res.status(200).json({
    status: 'success',
    message: 'tour was updated',
  });
};
exports.deleteUser = function (req, res) {
  res.status(200).json({
    status: 'success',
    data: 'null',
  });
};
