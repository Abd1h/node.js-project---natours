const Tour = require('../models/tourModels');
const SearchFeatures = require('../utils/searchFeatures'); //class of features methods

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
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
//            aggregation
//-------------------------------------------
exports.getTourStats = async function (req, res) {
  try {
    //call aggregate on the model "collection"
    const stats = await Tour.aggregate([
      {
        //stage 1 :get all tours that has price >=300
        $match: { price: { $gte: 300 } },
      },
      {
        //stage 2  : group tours that has the same id value with displaying some commen proprties
        $group: {
          _id: '$difficulty', //[ easy,medium,difficult ]
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          numTours: { $sum: 1 },
        },
      },
      {
        //stage 3 : sort them by price (1 = small to pig)
        $sort: { avgPrice: 1 },
      },
      //stage 4 : select all the docs that has the id not equal '$ne' easy
      {
        $match: { _id: { $ne: 'easy' } }, //note that we can repeat stages
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: { stats },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getYearStatus = async function (req, res) {
  try {
    const year = req.params.year * 1;
    console.log(new Date(`${year}-01-01`));
    const yearStatus = await Tour.aggregate([
      {
        //a tour can have 3 or more dates "happen multiple times a year", so to make a separate doc for every date
        $unwind: '$startDates',
      },
      {
        //select only the tours with the specified year
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        //group tours who has the same month
        $group: {
          _id: { $month: '$startDates' },
          numOfTours: { $sum: 1 }, //number of tours in every group
          toursName: { $push: '$name' },
        },
      },
      {
        //ading month instad of id
        $addFields: { month: '$_id' },
      },
      {
        $project: { _id: 0 },
      },
      {
        //sort descending
        $sort: { numOfTours: -1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      result: yearStatus.length,
      data: { yearStatus },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//-------------------------------------------
//       route methods functionality
//-------------------------------------------

exports.getAllTours = catchAsync(async (req, res, next) => {
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
});

exports.getSingleTour = catchAsync(async (req, res, next) => {
  //1) getting tour id from the URL
  const tourId = req.params.id;
  //2) look it up throw tour collection
  const tour = await Tour.findById(tourId);
  // const tour = await Tour.findOne({ _id: tourId });
  //3) error handling
  if (!tour) {
    return next(new AppError('no tour was found for this ID', 404));
  }
  res.status(200).json({
    status: 'sccuss',
    data: tour,
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
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
});

exports.updateTour = catchAsync(async (req, res, next) => {
  //1) getting targeted tour id
  const tourId = req.params.id;

  //2) update tour with the comming data
  //NOTE findByIdAndUpdate(ID, new data, options)
  const tour = await Tour.findByIdAndUpdate(tourId, req.body, {
    runValidators: true, // will rerun schema validators
    new: true, // returns the doc after update instead of the original
  });
  //3) error handling
  if (!tour) {
    return next(new AppError('no tour was found for this ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  const tour = await Tour.findByIdAndDelete(tourId);

  //- error handling
  if (!tour) {
    return next(new AppError('no tour was found for this ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

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
