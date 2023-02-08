// this code will run independently using "node (file path)"
//the goal is to "node (file path) --import/--delete" and use that options to take action
const mongoose = require('mongoose');

//to access env variable
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const fs = require('fs');

const Tour = require('../../models/tourModels');

const allTours = JSON.parse(
  //using JSON.parse to convert the string text to json "annoying error"
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//connecting to the data base
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

// 1) delete all tours on "--delete"
const deleteAllTours = async function () {
  try {
    await Tour.deleteMany();
    console.log('all tours are deleted');
  } catch (err) {
    console.log('error in deleting all tours', err);
  }
  process.exit();
};

// 2) import all tours from the local file and to the database on "--import"
const importAllTours = async function () {
  try {
    await Tour.create(allTours);
    console.log('all tours are added');
  } catch (err) {
    console.log('error in adding all tours', err);
  }
  process.exit();
};

//using process.argv wich gives an array of the command
if (process.argv[2] === '--import') {
  importAllTours();
}

if (process.argv[2] === '--delete') {
  deleteAllTours();
}
