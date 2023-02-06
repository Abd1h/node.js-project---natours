const mongoose = require('mongoose'); //library for mongoDB, a higher level of abstraction

const dotenv = require('dotenv'); //allow us to create environment variables using config file

dotenv.config({ path: './config.env' }); //must be before require app

const app = require('./app');

//<><><><><><><><><><><><><><><><><><><><><><><><><><>//
// getting our DB connection link after setting the mongoDB password
const DBlink = process.env.DATABASE.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD
);
//connecting with our database using mongoose
mongoose
  .connect(DBlink, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }) //NOTE mongoose connect methods return a promise with object
  .then(() => console.log('mongoose connected'));

const serverPort = 8000;
app.listen(serverPort, () => console.log(`app running on port ${serverPort}`));
