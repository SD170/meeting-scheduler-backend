const express = require("express");
const userIdConverter = require('../middlewares/userIdConverter');

//importing controller functions
const { createSchedule } = require("../controllers/schedule.controller");

const router = express.Router();

router.use(userIdConverter);
router.route("/").post(createSchedule);

module.exports = router;
