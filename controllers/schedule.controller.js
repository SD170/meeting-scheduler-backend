const asyncHandler = require("../middlewares/async");
const mongoose = require("mongoose");
const ScheduleModel = require("../models/Schedule.model");
const { RoomList } = require("../utils/RoomList");
const {
  checkUserAvailability,
  checkRoomAvailability,
  formatScheduleDates,
  formatUserIds,
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
              /**
               * Host can't be inside guest array
               */
              if(guestUserIds[i].toString() === userId.toString()){
                return res.status(400).json({
                  success: false,
                  message: `host can't be inside guest array`,
                });
              }
              const isGuestAvailable = await checkUserAvailability(
                guestUserIds[i],
                formattedMeetingDate,
                formattedStartTime,
                formattedEndTime
              );
              /**
               * guest is not free
               */
              if (!isGuestAvailable) {
                return res.status(400).json({
                  success: false,
                  message: `guest user: ${guestUsers[i]} is not avalible at this time`,
                });
              }
            }

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

            // formatting the time with client time
            const formattedDateMeeting = formatScheduleDates(savedSchedule);

            // formatting the _id's userId
            const formattedIdMeeting = await formatUserIds(formattedDateMeeting);

            res.status(200).json({
              success: true,
              data: formattedIdMeeting,
            });

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
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a hostUserId, roomId, meetingDate, startTime, endTime",
      });
    }
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

//  @desc       list meeting schedule by user
//  @route      GET /api/v1/schedule/byUser
//  @access     Public
exports.listScheduleForUser = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (userId) {
      /**
       * Searh meetings for guests and hosts
       */
      const meetings = await ScheduleModel.find({
        $or: [
          {
            hostUserId: userId,
          },
          {
            guestUsers: { $in: [userId] },
          },
        ],
      }).sort("meetingDate startTime");

      /**
       * Format dates
       */
      const formattedDateMeetings = meetings.map((meeting) =>
        formatScheduleDates(meeting)
      );
      /**
       * Format ids
       */
      const formattedIdMeetings = [];
      for (let i = 0; i < formattedDateMeetings.length; i++) {
        const meeting = await formatUserIds(formattedDateMeetings[i]);
        formattedIdMeetings.push(meeting);
      }

      res.status(200).json({
        success: true,
        data: formattedIdMeetings,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "send userId in query param",
      });
    }
  } catch (err) {
    return next(err);
  }
});

//  @desc       list meeting schedule by roomId
//  @route      GET /api/v1/schedule/byRoom
//  @access     Public
exports.listScheduleForRoom = asyncHandler(async (req, res, next) => {
  try {
    const { roomId } = req.query;
    if (roomId && RoomList.indexOf(roomId) !== -1) {
      const meetings = await ScheduleModel.find({
        roomId,
      }).sort("meetingDate startTime");

      /**
       * Format dates
       */
      const formattedDateMeetings = meetings.map((meeting) =>
        formatScheduleDates(meeting)
      );
      /**
       * Format ids
       */
      const formattedIdMeetings = [];
      for (let i = 0; i < formattedDateMeetings.length; i++) {
        const meeting = await formatUserIds(formattedDateMeetings[i]);
        formattedIdMeetings.push(meeting);
      }

      res.status(200).json({
        success: true,
        data: formattedIdMeetings,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "send a valid roomID in query params",
      });
    }
  } catch (err) {
    return next(err);
  }
});
