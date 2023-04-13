const mongoose = require('mongoose');
const validator = require('validator');
const becrypt = require('bcryptjs');
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
    Select: false,
  },
  passwordComfirm: {
    type: String,
    required: [true, 'please comfirm your password'],
    validate: {
      validator: function (val) {
        //works only on save(), so when updating you need to use save for this to work
        return this.password === val;
      },
      message: 'passwords are not the same',
    },
  },
});

//encryption middleware
userSchema.pre('save', async function (next) {
  //1) only run this if password was modified "updated or created"
  //isModified method that exist for all documents
  if (!this.isModified('password')) return next();

  //2) hash the password
  // cost = 12, is how much CPU you went to use "default is 10"
  this.password = await becrypt.hash(this.password, 12);

  //3) delete password confirm
  this.passwordComfirm = undefined;
  next();
});

//MODEL
const User = mongoose.model('User', userSchema);
module.exports = User;
