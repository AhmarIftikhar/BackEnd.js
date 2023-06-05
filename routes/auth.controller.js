// const express = require("express");
// const auth = require("../controllers/auth");

// const router = express.Router();

// router.post("/register", async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const user = await auth.register(email, password);
//     res.status(201).json({ message: "User registered successfully", user });
//   } catch (error) {
//     next(error);
//   }
// });

// router.post("/login", async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const result = await auth.login(email, password);
//     res.status(200).json({ message: "Login successful", result });
//   } catch (error) {
//     next(error);
//   }
// });

// router.post("/logout", async (req, res, next) => {
//   try {
//     const { userId } = req.body;
//     await auth.logout(userId);
//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (error) {
//     next(error);
//   }
// });

// router.post("/forgot-password", async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const user1 = await auth.forgotPassword(email);
//     res
//       .status(200)
//       .json({
//         message: "Password reset link sent successfully to your email",
//         user: user1,
//       });
//   } catch (error) {
//     next(error);
//   }
// });

// router.post("/reset-password", async (req, res, next) => {
//   try {
//     const { token, newPassword } = req.body;
//     await auth.resetPassword(token, newPassword);
//     res.status(200).json({ message: "Password reset successfully" });
//   } catch (error) {
//     next(error);
//   }
// });

// // Error handling middleware
// router.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Internal server error" });
// });

// module.exports = router;
const express = require("express");
const auth = require("../controllers/auth");

const router = express.Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);
module.exports = router;
