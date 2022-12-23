// -express
const express = require('express');
const app = express();
app.use(express.json()); //middleware for post method

// -public middlewares
const morgan = require('morgan');
app.use(morgan('dev'));

// -importing routes sub apps
const usersRouter = require('./routes/userRoutes');
const toursRouter = require('./routes/tourRoutes');

//<><><><><><><><><><><><><><><><><><><><><><><><><><>//

//mounting routers "since its a middleware"
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

//exporting to server.js file
module.exports = app;
