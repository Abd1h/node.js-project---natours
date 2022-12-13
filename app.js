const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

const app = express();
//// without this "middleware" the post method won't work,
app.use(express.json());

//// morgan middleware
app.use(morgan('dev'));

////middleware body
app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
  //without next() middleware life-cycle will be stuck
});

//downloading sync since we need to download it once
//if we did this inside a route function it will enter the "event loop" and slow our app
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
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

const createNewTour = function (req, res) {
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

//// handling tour route
app.route('/api/v1/tours').get(getAllTours).post(createNewTour);
app
  .route('/api/v1/tours/:id')
  .get(getSingleTour)
  .patch(updateTour)
  .delete(deleteTour);

const serverPort = 8000;
app.listen(serverPort);
