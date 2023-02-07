const mongoose = require('mongoose');

// creating mongoose schema for tours
const tourSchema = new mongoose.Schema({
  // setting key with only type or object of options
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: [true, 'use different name'],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'a tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'a tour must have a max group size'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  reatingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'a tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true, // this will trim all the extra spaces
    required: [true, 'a tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String, //cuz we will put the path of the img
    required: [true, 'a tour must have a cover img'],
  },
  createdAt: {
    type: Date, //NEW
    default: Date.now(), //will give time in ms, and mongoose will convert it to a date
  },
  startDates: [Date], // array of dates
  images: [String],
});
//creating module of that schema
//NOTE model name start with upper case letter
//NOTE the name of the collection will come from 'Tour'
const Tour = mongoose.model('Tour', tourSchema);

// export Tour to controlTours
module.exports = Tour;
