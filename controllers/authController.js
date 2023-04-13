const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//-------------------------------------------
//   functions
//-------------------------------------------
const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPIRED_DATE,
  });
};
//-------------------------------------------
//SIGN-UP
exports.signup = catchAsync(async (req, res, next) => {
  //1) create user with the required data req data
  //dont use req.body cuz user could manually put a roll
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordComfirm: req.body.passwordComfirm,
  });

  //2) sing in the user "create uniqe token"
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
  //3) error handled by (catchAsync)
});

//LOG-IN
exports.login = catchAsync(async (req, res, next) => {
  //1) check if (email,password) is given
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('please enter your email and password'), 400);

  //2) verify email (user exist?) // +password: adds hidden property
  const user = await User.findOne({ email: email }).select('+password');

  //3) verify user password
  let correctPassword = null;
  if (user) correctPassword = await user.checkPassword(password, user.password); //checkpassword = Instance method
  //error handling
  if (!correctPassword)
    return next(new AppError('Incorrect email or password', 401));

  //3) everything checked?.. send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
