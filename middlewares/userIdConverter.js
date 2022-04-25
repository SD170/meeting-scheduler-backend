const UserModel = require("../models/User.model");
const userIdConverter = async (req, res, next) => {
  if (req.body.userId) {
    const user = await UserModel.findOne({ userId: req.body.userId });
    if (user) {
      req.body.userId = user._id;
    } else {
      res.status(404).json({
        success: false,
        message: `no user exists with this userId`,
      });
    }
  }
  if (req.body.guestUsers) {
    const convertedGuestList = [];
    for (let i = 0; i < req.body.guestUsers.length; i++) {
      const user = await UserModel.findOne({ userId: req.body.guestUsers[i] });
      if (!user) {
        res.status(404).json({
          success: false,
          message: `no user exists with userId ${req.body.guestUsers[i]}`,
        });
      } else {
        convertedGuestList.push(user._id);
      }
    }
    req.body.guestUserIds = convertedGuestList;
    // console.log(req.body.formatted,"middle");
    // next();
  }
  next();
  // if(req.body)
  // console.log(req.body.hostUserId);
};

module.exports = userIdConverter;
