const mongoose = require('mongoose'); //library for mongoDB, a higher level of abstraction
const dotenv = require('dotenv'); //allow us to create environment variables using config file

//-------------------------------------------
//Catching uncaught exceptions //must be before any code
process.on('uncaughtException', (err) => {
  console.log('uncaught exceptions! SHUTTING DOWN...');
  console.log(err.name, err.message);

  process.exit(1);
});
//-------------------------------------------

dotenv.config({ path: './config.env' }); //must be before require app

const app = require('./app');

//<><><><><><><><><><><><><><><><><><><><><><><><><><>//
// getting our DB connection link after setting the mongoDB password
const DBlink = process.env.DATABASE.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD
);
//connecting with our database using mongoose ✔
mongoose
  .connect(DBlink, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }) //NOTE mongoose connect methods return a promise with object
  .then(() => console.log('mongoose connected'));

//starting our server
const serverPort = 8000;
const server = app.listen(serverPort, () =>
  console.log(`app running on port ${serverPort}`)
);

//handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! SHUTTING DOWN...');
  console.log(err.name, err.message);
  server.close(() => {
    //shutting down after close finish, to give the sever some time
    process.exit(1);
  });
});
