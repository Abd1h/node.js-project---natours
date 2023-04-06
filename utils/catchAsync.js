//notes
//- goal here is to get rid of (try/catch) and catch the error in the globalErrorHandler()
//- rounts functions will be the parameter (fn) and they are async
module.exports = function (fn) {
  // getting rid of function called immediately issue --> by return another function
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
//- must add the next parameter to all routes funcitons so we can pass the "err" to the globalErrorHandler
