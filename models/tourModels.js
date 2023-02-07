const mongoose = require('mongoose');

// creating mongoose schema for tours
const tourSchema = new mongoose.Schema({
  // setting key with only type or object of options
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: [true, 'use different name'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'a tour must have a price'],
  },
});
//creating module of that schema
//NOTE model name start with upper case letter
//NOTE the name of the collection will come from 'Tour'
const Tour = mongoose.model('Tour', tourSchema);

// export Tour to controlTours
module.exports = Tour;
