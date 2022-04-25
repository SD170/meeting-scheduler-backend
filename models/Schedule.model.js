const mongoose = require("mongoose");
const { Schema } = mongoose;

const ScheduleSchema = new mongoose.Schema(
  {
    hostUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please add userId"],
    },
    guestUsers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    roomId: {
      type: String,
      required: [true, "Please add roomId"],
    },
    meetingDate: {
      type: Date,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Schedule", ScheduleSchema);
