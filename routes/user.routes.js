const express = require("express");

//importing controller functions
const { createUser, listUsers } = require("../controllers/user.controller");

const router = express.Router();

router.route("/").get(listUsers).post(createUser);

module.exports = router;
