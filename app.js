// -express
const express = require('express');
const app = express();
//exporting to server.js file
module.exports = app;
app.use(express.json()); //middleware for post method

// -public middlewares
const morgan = require('morgan');

// -importing routes sub apps
const usersRouter = require('./routes/userRoutes');
const toursRouter = require('./routes/tourRoutes');
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

//<><><><><><><><><><><><><><><><><><><><><><><><><><>//
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// build in middleware to acces static files form the browser without setting a route for it
app.use(express.static('./public'));
