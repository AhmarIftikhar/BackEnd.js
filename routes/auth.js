const express = require("express");
const authController = require("./auth.controller");

const router = express.Router();

router.use("/auth", authController);

module.exports = router;
