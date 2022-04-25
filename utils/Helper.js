const mongoose = require("mongoose");
const ScheduleModel = require("../models/Schedule.model");
const UserModel = require("../models/User.model");
/**
 * requested startTime should NOT be more than than other meetings's startTime
 * also it should NOT be less than other meetings's endTime.
 *
 * Same for requested endTime.
 *
 * We're checking for the same in the next aggregation.
 * If we can find even 1 meeting which follow the given case, the requested
 * meeting is invalid.
 */
const checkUserAvailability = async (
  userId,
  formattedMeetingDate,
  formattedStartTime,
  formattedEndTime
) => {
  const Query = [
    {
      $match: {
        hostUserId: userId,
        meetingDate: formattedMeetingDate,
        // 'roomId':roomId,
        $or: [
          {
            startTime: {
              $lte: formattedStartTime,
            },
            endTime: {
              $gte: formattedStartTime,
            },
          },
          {
            startTime: {
              $lte: formattedEndTime,
            },
            endTime: {
              $gte: formattedEndTime,
            },
          },
        ],
      },
    },
  ];

  const overlappedMeetings = await ScheduleModel.aggregate(Query);

  return overlappedMeetings.length === 0 ? true : false;
};
const checkRoomAvailability = async (
  roomId,
  formattedMeetingDate,
  formattedStartTime,
  formattedEndTime
) => {
  const Query = [
    {
      $match: {
        roomId: roomId,
        meetingDate: formattedMeetingDate,
        $or: [
          {
            startTime: {
              $lte: formattedStartTime,
            },
            endTime: {
              $gte: formattedStartTime,
            },
          },
          {
            startTime: {
              $lte: formattedEndTime,
            },
            endTime: {
              $gte: formattedEndTime,
            },
          },
        ],
      },
    },
  ];

  const overlappedMeetings = await ScheduleModel.aggregate(Query);

  return overlappedMeetings.length === 0 ? true : false;
};
const checkUserAndRoomAvailability = async (
  userId,
  roomId,
  formattedMeetingDate,
  formattedStartTime,
  formattedEndTime
) => {
  const Query = [
    {
      $match: {
        hostUserId: userId,
        meetingDate: formattedMeetingDate,
        roomId: roomId,
        $or: [
          {
            startTime: {
              $lte: formattedStartTime,
            },
            endTime: {
              $gte: formattedStartTime,
            },
          },
          {
            startTime: {
              $lte: formattedEndTime,
            },
            endTime: {
              $gte: formattedEndTime,
            },
          },
        ],
      },
    },
  ];

  const overlappedMeetings = await ScheduleModel.aggregate(Query);
  console.log(overlappedMeetings);
  return overlappedMeetings.length === 0 ? true : false;
};

/**
 * Refactoring the timezone for the client
 * https://www.mongodb.com/docs/v3.2/tutorial/model-time-data/
 */

const formatScheduleDates = (meeting) => {
  meeting.meetingDate = new Date(
    meeting.meetingDate.getTime() - meeting.offset * 60000
  );
  meeting.startTime = new Date(
    meeting.startTime.getTime() - meeting.offset * 60000
  );
  meeting.endTime = new Date(
    meeting.endTime.getTime() - meeting.offset * 60000
  );

  return meeting;
};

const formatUserIds = async (meeting) => {
  /**
   * Creating a new object newMeeting, as meeting's hostUserId can only hold ObjectId type,
   * hostUser.userId is of type string.
   * meeting is a mongo object type wih multiple hidden values.
   * meeting._doc is the object we want.
   */
  const newMeeting = meeting._doc;
  /**
   * geeting the userId of host
   */
  const hostUser = await UserModel.findById(meeting.hostUserId);

  /**
   * setting userID as hostUserId.
   *
   */

  newMeeting.hostUserId = hostUser.userId;

  /**
   * geeting the userId of guests.
   */
  const guestList = [];
  for(let i=0;i<newMeeting.guestUsers.length;i++){
    const guest = await UserModel.findById(newMeeting.guestUsers[i]);
    guestList.push(guest.userId);
  }

  /**
   * Setting the guestList
   */
   newMeeting.guestUsers = guestList;

  return newMeeting;
};

module.exports = {
  checkUserAvailability,
  checkRoomAvailability,
  formatScheduleDates,
  formatUserIds,
  checkUserAndRoomAvailability,
};
