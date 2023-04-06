// -express
const express = require('express');

const app = express();
//exporting to server.js file
module.exports = app;
app.use(express.json()); //middleware for post method

// -public middlewares
const morgan = require('morgan');
// -utils classes
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/controlError');
// -importing routes sub apps
const usersRouter = require('./routes/userRoutes');
const toursRouter = require('./routes/tourRoutes');

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

//if above two routes didnt handle the call, then the route is invalide
//all()=post get patch...
app.all('*', (req, res, next) => {
  const err = new Error(`can't find ${req.originalUrl} on this server`);
  err.status = 'fail';
  err.statusCode = 404;
  // next(err);
  next(
    new AppError(`can't find ${req.originalUrl} on this server`, err.statusCode)
  );
});

//ERROR HANDLING MIDDELWARE
app.use(globalErrorHandler);

//<><><><><><><><><><><><><><><><><><><><><><><><><><>//
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// build in middleware to acces static files form the browser without setting a route for it
app.use(express.static('./public'));
