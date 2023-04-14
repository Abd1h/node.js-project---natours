const { promisify } = require('util');
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
    changedPasswordAt: req.body.changedPasswordAt,
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

//check access to tour data
exports.protect = catchAsync(async (req, res, next) => {
  //1) getting token from headers
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('please log in first!!', 401));
  }

  // 2) VERIFY TOKEN (token manipulated?,token expired?)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECERT);
  //decoded = { id: '6437c653d7dc3f3ed42dac78', iat: 1681395477, exp: 1689171477 }
  //errors names: "name": "JsonWebTokenError" ||||"name": "TokenExpiredError"

  // 3) check if user still exists (loged in)
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('please log-in, and try again'), 401);
  }

  // 4) check if user chagned password after token was issued 'created'
  const passwordChangedAfterStatus = currentUser.passwordChangedAfter(
    decoded.iat
  ); //Instance Method

  if (passwordChangedAfterStatus) {
    return next(
      new AppError('passoword has been changed recently, please log-in again')
    );
  }
  //everything checked☑, give access
  req.user = currentUser;
  next();
});
