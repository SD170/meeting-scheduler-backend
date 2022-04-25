const ScheduleModel = require("../models/Schedule.model");
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
const checkUserAvailability = async (userId, formattedMeetingDate, formattedStartTime, formattedEndTime) => {
    const Query = [
        {
          '$match': {
            'hostUserId': userId,
            'meetingDate': formattedMeetingDate,
            // 'roomId':roomId,
            '$or':[
              {
                'startTime': {
                  '$lte': formattedStartTime
                },
                'endTime': {
                  '$gte': formattedStartTime
                }
              },
              {
                'startTime': {
                  '$lte': formattedEndTime
                },
                'endTime': {
                  '$gte': formattedEndTime
                }
              },
            ]
          }
        }
      ]

      const overlappedMeetings = await ScheduleModel.aggregate(Query);

      return (overlappedMeetings.length === 0) ?true:false;

}
const checkRoomAvailability = async (roomId, formattedMeetingDate, formattedStartTime, formattedEndTime) => {
    const Query = [
        {
          '$match': {
            'roomId':roomId,
            'meetingDate': formattedMeetingDate,
            '$or':[
              {
                'startTime': {
                  '$lte': formattedStartTime
                },
                'endTime': {
                  '$gte': formattedStartTime
                }
              },
              {
                'startTime': {
                  '$lte': formattedEndTime
                },
                'endTime': {
                  '$gte': formattedEndTime
                }
              },
            ]
          }
        }
      ]

      const overlappedMeetings = await ScheduleModel.aggregate(Query);

      return (overlappedMeetings.length === 0) ?true:false;

}
const checkUserAndRoomAvailability = async (userId, roomId, formattedMeetingDate, formattedStartTime, formattedEndTime) => {
    const Query = [
        {
          '$match': {
            'hostUserId': userId,
            'meetingDate': formattedMeetingDate,
            'roomId':roomId,
            '$or':[
              {
                'startTime': {
                  '$lte': formattedStartTime
                },
                'endTime': {
                  '$gte': formattedStartTime
                }
              },
              {
                'startTime': {
                  '$lte': formattedEndTime
                },
                'endTime': {
                  '$gte': formattedEndTime
                }
              },
            ]
          }
        }
      ]

      const overlappedMeetings = await ScheduleModel.aggregate(Query);
      console.log(overlappedMeetings);
      return (overlappedMeetings.length === 0) ?true:false;

}

module.exports={
    checkUserAvailability,
    checkRoomAvailability,
    checkUserAndRoomAvailability
}