const mongoose = require('mongoose');
const slugify = require('slugify');
// creating mongoose schema for tours
const tourSchema = new mongoose.Schema(
  {
    // setting key with only type or object of options
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: [true, 'use different name'],
      trim: true,
      maxlength: [40, 'tour name must be less or equal 40 characters'],
      minlength: [10, 'tour name must be more or equal 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'a tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a max group size'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: {
        //allow a specific limited values 'for strings only'
        //we created object cuz we cant add error message
        values: ['easy', 'medium', 'difficult'],
        message: `diffculty is either :'easy', 'medium', 'difficult'`,
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be above 1.0'], //work on date too
      max: [5, 'rating must be below 5'],
    },
    reatingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        //custom validator
        validator: function (val) {
          return val < this.price;
        },
        message: 'discount must be less then the original price',
      },
    },
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

    //tours that wont diplays
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  //options object
  {
    //virtual properties settings
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//virtual properties
tourSchema.virtual('durationWeek').get(function () {
  //1) must return the proprite value
  //2) this prop will be created on every get call
  //3) ()=> has issues with the 'this keyword'
  return this.duration / 7;
});

//MONGOOSE MIDDLEWARE
//1) DOCUMENT MIDDLEWARE :runs before/after .save() .create()
tourSchema.pre('save', function (next) {
  // console.log(this); // return the created document

  //1) creating slug : slug is a string of the document name that will be added to the schema by npm package 'slugify'
  // after adding slug : string to the schema
  this.slug = slugify(this.name, { lower: true }); // also make it lowercase
  //2)moving to the next middleware
  next();
});

//this runs after saving the doc to the DB
tourSchema.post('save', (doc, next) => {
  //console.log(doc); //note that we dont use this.keyword cuz post has accses to the created doc object
  next();
});

//2) QUERY MIDDLEWARE "runs before/after any find query is excuted"
tourSchema.pre(/^find/, function (next) {
  //thit.keyword will point to the query of the find method
  //and like we chanied .filtering() .sorting() on that query we can chain another find method

  this.find({ secretTour: { $ne: true } }); //filtering secret tours from the query

  next();
});

tourSchema.post(/^find/, (docs, next) => {
  console.log(docs); //post here has accses to all docs returned form the query
  next();
});

//3 AGGREGATION MIDDLEWARE "runs before/after every aggregation"
tourSchema.pre('aggregate', function (next) {
  //console.log(this.); //points to the current aggregation object
  // "this.pipeline()" returns the array we passed into aggregation([])

  //eliminating secert tours from aggregation
  this.pipline().unshift({ $match: { secretTour: { $ne: true } } }); //'unshift' adds el to the start of an array
  next();
});
//creating module of that schema
//NOTE model name start with upper case letter
//NOTE the name of the collection will come from 'Tour'
const Tour = mongoose.model('Tour', tourSchema);

// export Tour to controlTours
module.exports = Tour;
