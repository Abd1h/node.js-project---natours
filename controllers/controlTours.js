const Tour = require('../models/tourModels');

exports.getAllTours = async function (req, res) {
  try {
    // 1) FILTERING url using the query string
    //note const queryObj = req.query; --> 🛑WRONG
    const queryObj = { ...req.query };

    const excludedFields = ['page', 'sort', 'limit', 'fields']; //not for searching keys
    excludedFields.forEach((el) => delete queryObj[el]);

    // * advance FILTERING
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g, //b = this exact word,g = everywhere
      (match) => `$${match}` //note: replace return a callback
    );
    //note we dont await so we can use other methods 'sort,skip..'
    let query = Tour.find(JSON.parse(queryString));

    // 2) SORTING
    //127.0.0.1:8000/api/v1/tours?name=aaa&sort=-price,duration --> means sort by 'price' and if they have the same price then sort them by 'duration'..
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      //note that sort return a query so you can chain other methods
      query = query.sort(sortBy);
    } else {
      //defualt --> sort by date
      query = query.sort('_createdAt');
    }

    // 3) FIELD LIMIGING 'not sending all keys of the data object'
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      // remove fields that are created by mongoose like (__v) using (-)
      query.select('-__v');
    }

    // 4) PAGINATION '/api/v1/tours? page=2 & limit=5'

    // page.1 => 1-5 // page.2 => 6-10 // page.3 => 11-15
    // methods => skip() ,limit()
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 100;
    const skipNum = (page - 1) * limit;

    query = query.skip(skipNum).limit(limit);
    //if user skips all tours
    if (req.query.page) {
      const numberOfTours = await Tour.countDocuments();
      if (skipNum >= numberOfTours) throw new Error('This Page Dose Not Exist');
    }
    // * EXECUTE QUERY
    const tours = await query;
    //note: if there is query string -->{name = The Sea}
    //and   if there isnt -->{empty} which will select all tours
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
