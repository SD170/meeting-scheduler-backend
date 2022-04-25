const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    trim: true,
  },
});

UserSchema.pre("save", function (next) {
  const self = this;
  self.constructor.count(function (err, count) {
    if (err) {
      return next(err);
    }
    self.userId = `U${count+1}`;
    // self._id=`U${count+1}`
    // console.log(self._id);
    next();
  });
  // next();
});

module.exports = mongoose.model("User", UserSchema);
