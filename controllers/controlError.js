const AppError = require('../utils/appError');
//-------------------------------------------
//                FUNCTIONS
//-------------------------------------------
const handleDevelopmentError = function (res, err) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const handleProductionError = function (res, err) {
  //1) handle operation error (errors that we handled and set responds for)
  if (err.operationalError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //2) unknown errors
  else {
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
      error: err,
    });
  }
};
//-------------------------------------------
//mongoDB error functions
const handleCastErrorDB = function (err) {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = function (err) {
  //1) getting the duplicated field from errmsg string
  //using RexEx "(.*?)" which returns an array
  const duplicatedValue = err.errmsg.match(/"(.*?)"/)[0];

  //2) set message
  const message = `Duplicated field value: ${duplicatedValue}, please use different value`;
  return new AppError(message, 400);
};

const handleValidatorErrorDB = function (err) {
  //1)  getting array of all validation errors
  const errorsArray = Object.values(err.errors).map((el) => el.message);
  //2) creating error message
  const message = errorsArray.join('  +  ');

  return new AppError(message, 400);
};
//-------------------------------------------
//-------------------------------------------

//'gloablErrorHandler' middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //DEVELOPMENT
  if (process.env.NODE_ENV === 'development') {
    handleDevelopmentError(res, err);
  }

  //PRODUCTION
  if (process.env.NODE_ENV === 'production') {
    //1) handle (make them operational errors)
    // mongoDB 3 errors (duplicate name , invalid Id , difficulty validation )

    //A) invalid ID "eeeeee"
    if (err.name === 'CastError') {
      const error = handleCastErrorDB(err);
      return handleProductionError(res, error);
    }

    //B) duplicate fields
    if (err.code === 11000) {
      const error = handleDuplicateFieldsDB(err);
      return handleProductionError(res, error);
    }

    //C) validation error
    if (err.name === 'ValidationError') {
      const error = handleValidatorErrorDB(err);
      return handleProductionError(res, error);
    }
    handleProductionError(res, err);
  }
};
