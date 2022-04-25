const asyncHandler = require("../middlewares/async");
const mongoose = require("mongoose");
const ScheduleModel = require("../models/Schedule.model");
const { RoomList } = require("../utils/RoomList");
const {
  checkUserAvailability,
  checkRoomAvailability,
  checkUserAndRoomAvailability,
} = require("../utils/Helper");

//  @desc       create a meeting
//  @route      POST /api/v1/schedule
//  @access     Public
exports.createSchedule = asyncHandler(async (req, res, next) => {
  try {
    // guestUserIds is from middleware(userIdConverter)
    const {
      userId,
      roomId,
      meetingDate,
      startTime,
      endTime,
      guestUsers,
      guestUserIds,
    } = req.body;
    if (userId && roomId && meetingDate && startTime && endTime) {
      // checking if the roomId actually exists
      if (RoomList.indexOf(roomId) !== -1) {
        // console.log(req.body);
        const formattedMeetingDate = new Date(meetingDate);
        const formattedStartTime = new Date(meetingDate + "T" + startTime);
        const formattedEndTime = new Date(meetingDate + "T" + endTime);
        /**
         * Checking if the host user is available
         */
        const isUserAvailable = await checkUserAvailability(
          userId,
          formattedMeetingDate,
          formattedStartTime,
          formattedEndTime
        );
        if (isUserAvailable) {
          const isRoomAvailable = await checkRoomAvailability(
            roomId,
            formattedMeetingDate,
            formattedStartTime,
            formattedEndTime
          );
          /**
           * Checking if the room is available
           */
          if (isRoomAvailable) {
            /**
             * Checking if the guests are free or not
             */
            for (let i = 0; i < guestUserIds.length; i++) {
              const isGuestAvailable = await checkUserAvailability(
                guestUserIds[i],
                formattedMeetingDate,
                formattedStartTime,
                formattedEndTime
              );
              if (!isGuestAvailable) {
                return res.status(400).json({
                  success: false,
                  message: `guest user: ${guestUsers[i]} is not avalible at this time`,
                });
              }
            }

            // console.log(result);
            // const formattedRes = result.map((r)=>{
            //   r.meetingDate = new Date( r.meetingDate.getTime() -  ( r.offset * 60000 ) )
            //   r.startTime = new Date( r.startTime.getTime() -  ( r.offset * 60000 ) )
            //   r.endTime = new Date( r.endTime.getTime() -  ( r.offset * 60000 ) )

            //   return r;
            // })
            // console.log(formattedRes);
            // console.log(result.length);

            /**
             * Creating the meeting
             */
            const schedule = new ScheduleModel({
              hostUserId: userId,
              guestUsers: guestUserIds,
              roomId,
              meetingDate: formattedMeetingDate,
              startTime: formattedStartTime,
              endTime: formattedEndTime,
              offset: new Date().getTimezoneOffset(),
            });
            /**
             * Saving the meeting
             */
            const savedSchedule = await schedule.save();

            /**
             * Refactoring the timezone for the client
             * https://www.mongodb.com/docs/v3.2/tutorial/model-time-data/
             */
            savedSchedule.meetingDate = new Date(
              savedSchedule.meetingDate.getTime() - savedSchedule.offset * 60000
            );
            savedSchedule.startTime = new Date(
              savedSchedule.startTime.getTime() - savedSchedule.offset * 60000
            );
            savedSchedule.endTime = new Date(
              savedSchedule.endTime.getTime() - savedSchedule.offset * 60000
            );

            res.status(200).json({
              success: true,
              data: {
                savedSchedule,
              },
            });

            // res.send("ss");
          } else {
            return res.status(400).json({
              success: false,
              message: "The room is not empty in this time slot",
            });
          }
        } else {
          return res.status(400).json({
            success: false,
            message: "The host user has different meeting at this time",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "No such roomId exists",
          // data: {
          //   id: savedSchedule._id,
          //   userId: savedSchedule.userId,
          // },
        });
      }
    } else {
      return res.status(400).json({
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
    console.log(err);
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
