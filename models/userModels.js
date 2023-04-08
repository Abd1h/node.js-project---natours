const mongoose = require('mongoose');
const validator = require('validator');

//SCHEMA
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'please enter your name'] },
  email: {
    type: String,
    required: [true, 'please enter your email'],
    unique: true,
    lowercase: true, //convert to lowercase
    validate: [validator.isEmail, 'please enter a valid email'], //custom validator to check--> abdlh@gmaile.com
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'please enter a password'],
    minlength: 8,
  },
  passwordComfirm: {
    type: String,
    required: [true, 'please comfirm your password'],
  },
});

//MODEL
const User = mongoose.model('User', userSchema);
module.exports = User;
