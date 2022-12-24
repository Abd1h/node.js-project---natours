// -express
const express = require('express');
const app = express();
//exporting to server.js file
module.exports = app;
app.use(express.json()); //middleware for post method

// -public middlewares
const morgan = require('morgan');
app.use(morgan('dev'));

// -importing routes sub apps
const usersRouter = require('./routes/userRoutes');
const toursRouter = require('./routes/tourRoutes');
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

//<><><><><><><><><><><><><><><><><><><><><><><><><><>//
