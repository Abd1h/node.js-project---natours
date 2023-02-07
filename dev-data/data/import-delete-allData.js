// this code will run only once in the beggining
const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const fs = require('fs');

const Tour = require('../../models/tourModels');

const allTours = JSON.parse(
  //dont fucking forget
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const DBlink = process.env.DATABASE.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DBlink, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('mongoose connected'));

const deleteAllTours = async function () {
  try {
    await Tour.deleteMany();
    console.log('all tours are deleted');
  } catch (err) {
    console.log('error in deleting all tours', err);
  }
  process.exit();
};

//this function job is to get all the data form tours-simple.js and add them to the database
const importAllTours = async function () {
  try {
    await Tour.create(allTours);
    console.log('all tours are added');
  } catch (err) {
    console.log('error in adding all tours', err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importAllTours();
}

if (process.argv[2] === '--delete') {
  deleteAllTours();
}
