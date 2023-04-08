const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  //1) create user the the req data
  const newUser = await User.create(req.body);
  //2) send respons
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
  //3) error handled by (catchAsync)
});
