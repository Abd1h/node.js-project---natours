const Tour = require('../models/tourModels');
const SearchFeatures = require('../utils/searchFeatures'); //class of features methods
//-------------------------------------------
//         middleware
//-------------------------------------------
//function to manipulate the search query | runs before getAllTours()
exports.top5Cheap = function (req, res, next) {
  console.log('running');
  // tours/top-5-cheap ---> tours/limit=5&sort=-ratingsAverage,price
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//-------------------------------------------
//       route methods functionality
//-------------------------------------------
exports.getAllTours = async function (req, res) {
  try {
    //1) getting result form DB after applying our search features
    const searchQuery = new SearchFeatures(req.query, Tour.find())
      .filtering()
      .sorting()
      .fieldsLimiting()
      .pagination();
    // 2) await for query result
    const tours = await searchQuery.queryResults;
    // 3) send back resurlt as a respond
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

exports.updateTour = async function (req, res) {
  try {
    //1) getting targeted tour id
    const tourId = req.params.id;
    //1) update tour with the comming data
    //NOTE findByIdAndUpdate(ID, new data, options)
    const tour = await Tour.findByIdAndUpdate(tourId, req.body, {
      runValidators: true, // will rerun schema validators
      new: true, // returns the doc after update instead of the original
    });
    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.deleteTour = async function (req, res) {
  try {
    const tourId = req.params.id;
    const tour = await Tour.findByIdAndDelete(tourId);

    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
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
