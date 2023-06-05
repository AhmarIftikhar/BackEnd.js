const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Token = require("../models/token.model");

const auth = {
  register: async (req, res) => {
    const { email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ email, password: hashedPassword });
      await user.save();

      return res.status(201).json({
        success: true,
        message: "User created",
        user: user.toJSON(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error in register: ${error.message}`,
      });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: user.toJSON(),
        token,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error in login: ${error.message}`,
      });
    }
  },

  logout: async (req, res) => {
    const { userId } = req.body;
    try {
      await Token.deleteMany({ userId });

      return res
        .status(200)
        .json({ success: true, message: "Logout successful" });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error in logout: ${error.message}`,
      });
    }
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const token = crypto.randomBytes(20).toString("hex");

      const tokenObject = new Token({ userId: user._id, token });
      await tokenObject.save();

      // send email with token here

      return res.status(200).json({
        success: true,
        message: "Token created",
        user: user.toJSON(),
        token,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error in forgotPassword: ${error.message}`,
      });
    }
  },

  resetPassword: async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      const tokenObject = await Token.findOne({ token });

      if (!tokenObject) {
        throw new Error("Invalid or expired token");
      }

      const user = await User.findById(tokenObject.userId);
      if (!user) {
        throw new Error("User not found");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      await tokenObject.remove();

      return res.status(200).json({
        success: true,
        message: "Password reset successful",
        user: user.toJSON(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error in resetPassword: ${error.message}`,
      });
    }
  },
};
module.exports = auth;
