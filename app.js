const express = require('express');
const morgan = require('morgan');

const usersRouter = require('./routes/userRoutes');
const toursRouter = require('./routes/tourRoutes');

const app = express();
//// without this "middleware" the post method won't work,
app.use(express.json());

//// morgan middleware
app.use(morgan('dev'));

//1) mounting router "since its a middleware"
app.use('/api/v1/tours', toursRouter);

//// handling user route
app.use('/api/v1/users', usersRouter);

const serverPort = 8000;
app.listen(serverPort);
