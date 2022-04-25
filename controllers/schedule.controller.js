const asyncHandler = require("../middlewares/async");
const mongoose = require("mongoose");
const ScheduleModel = require("../models/Schedule.model");
const { RoomList } = require("../utils/RoomList");

//  @desc       create a meeting
//  @route      POST /api/v1/schedule
//  @access     Public
exports.createSchedule = asyncHandler(async (req, res, next) => {
  try {
    // guestUserIds is from middleware(userIdConverter)
    const { userId, roomId, meetingDate, startTime, endTime, guestUsers, guestUserIds } =
      req.body;
    if (userId && roomId && meetingDate && startTime && endTime) {
      // checking if the roomId actually exists
      if (RoomList.indexOf(roomId) !== -1) {
        // console.log(req.body);
        const formattedMeetingDate = new Date(meetingDate);
        const formattedStartTime = new Date(meetingDate + "T" + startTime);
        const formattedEndTime = new Date(meetingDate + "T" + endTime);


        console.log(guestUserIds,"cont");
        const schedule = new ScheduleModel({
          hostUserId: userId,
          guestUsers:guestUserIds,
          roomId,
          meetingDate: formattedMeetingDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
        });
        const savedSchedule = await schedule.save();

        res.status(200).json({
          success: true,
          data: savedSchedule,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "No such roomId exists",
          // data: {
          //   id: savedSchedule._id,
          //   userId: savedSchedule.userId,
          // },
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message:
          "Please provide a hostUserId, roomId, meetingDate, startTime, endTime",
        // data: {
        //   id: savedSchedule._id,
        //   userId: savedSchedule.userId,
        // },
      });
    }
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
