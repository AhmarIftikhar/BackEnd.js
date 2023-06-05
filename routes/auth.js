// const express = require("express");
// const router = express.Router();

// const authController = require("../controllers/auth");

// router.post("/register", authController.register);
// router.post("/login", authController.login);
// router.get("/logout", authController.logout);

// module.exports = router;

const express = require("express");
const authController = require("./auth.controller");

const router = express.Router();

router.use("/auth", authController);

module.exports = router;
