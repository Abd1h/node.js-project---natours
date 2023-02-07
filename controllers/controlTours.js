const Tour = require('../models/tourModels');

exports.getAllTours = async function (req, res) {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: tours,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getSingleTour = async function (req, res) {
  try {
    //1) getting tour id from the URL
    const tourId = req.params.id;
    //2) look it up throw tour collection
    const tour = await Tour.findById(tourId);
    // const tour = await Tour.findOne({ _id: tourId });

    res.status(200).json({
      status: 'sccuss',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async function (req, res) {
  try {
    //1) getting post data
    const tourData = req.body;

    //2) creatting new db document
    //NOTE that create() return a promise
    const newTour = await Tour.create(tourData);

    //201 means "updated"
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    //400 means "bad input"
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateTour = function (req, res) {
  res.status(200).json({
    status: 'success',
    message: 'tour was updated',
  });
};
exports.deleteTour = function (req, res) {
  res.status(200).json({
    status: 'success',
    data: 'null',
  });
};

//// ---------------functions-------------------
//<><><><> not need for the commented code since our mongoose schema will do the validation for us <><><><>//

// //callback function of param middleware
// exports.checkID = (req, res, next, val) => {
//   const tour = tours.find((tourEl) => tourEl.id === +val);

//   //return the res, meaning return from here and dont move to the next middleware, so we dont get the error of sending multiple respons
//   if (!tour) {
//     return res.status(404).json({ status: 'fail', message: 'invalid ID' });
//   }
//   next();
// };

// // checking req body for post method
// exports.checkPostData = (req, res, next) => {
//   const postData = req.body;
//   if (!postData.name || !postData.price) {
//     return res
//       .status(404)
//       .json({ status: 'fail', message: 'not a vaild name or price' });
//   }
//   next();
// };
