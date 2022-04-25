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
    self.userId = `R${count+1}`;
    next();
  });
  // next();
});

module.exports = mongoose.model("User", UserSchema);
