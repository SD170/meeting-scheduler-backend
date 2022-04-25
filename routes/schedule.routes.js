const express = require("express");
const userIdConverter = require('../middlewares/userIdConverter');

//importing controller functions
const { createSchedule, listScheduleForUser, listScheduleForRoom } = require("../controllers/schedule.controller");

const router = express.Router();

router.use(userIdConverter);
router.route("/").post(createSchedule);
router.route("/byUser").get(listScheduleForUser);
router.route("/byRoom").get(listScheduleForRoom);

module.exports = router;
