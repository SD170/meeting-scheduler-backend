const asyncHandler = require("../middlewares/async");
const mongoose = require("mongoose");
const UserModel = require("../models/User.model");

//  @desc       create single user
//  @route      POST /api/v1/users
//  @access     Public
exports.createUser = asyncHandler(async (req, res, next) => {
  try {
    const user = new UserModel({});
    const savedUser = await user.save();
    res.status(200).json({
      success: true,
      data: {
        id: savedUser._id,
        userId: savedUser.userId,
      },
    });
  } catch (err) {
    return next(err);
  }
});

//  @desc       list users
//  @route      get /api/v1/users
//  @access     Public
exports.listUsers = asyncHandler(async (req, res, next) => {
  try {
    const userList = await UserModel.find().select(["-__v"]);
    res.status(200).json({
      success: true,
      data: userList,
    });
  } catch (err) {
    return next(err);
  }
});
