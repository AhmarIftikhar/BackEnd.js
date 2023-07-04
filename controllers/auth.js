const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Token = require("../models/token.model");
const TableData = require("../models/table.data");

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

  // TableData API - Get all table data
  getTableData: async (req, res) => {
    try {
      const tableData = await TableData.find();
      return res.status(200).json({
        success: true,
        message: "Table data fetched successfully",
        tableData: tableData.map((data) => data.toJSON()),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error in getting table data: ${error.message}`,
      });
    }
  },

  // TableData API - Create new table data
  createTableData: async (req, res) => {
    try {
      const { name, email, image, title, department, status, position } =
        req.body;

      const existingData = await TableData.findOne({ email });
      if (existingData) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      const newData = new TableData({
        name,
        email,
        image,
        title,
        department,
        status,
        position,
      });

      await newData.save();

      return res.status(201).json({
        success: true,
        message: "Table data created",
        data: newData.toJSON(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error in creating table data: ${error.message}`,
      });
    }
  },

  editTableData: async (req, res) => {
    try {
      const { id } = req.params; // Get the ID from the request params
      const { name, email, image, title, department, status, position } =
        req.body;

      const existingData = await TableData.findById(id);
      if (!existingData) {
        return res.status(404).json({
          success: false,
          message: "Table data not found",
        });
      }

      existingData.name = name;
      existingData.email = email;
      existingData.image = image;
      existingData.title = title;
      existingData.department = department;
      existingData.status = status;
      existingData.position = position;

      await existingData.save();

      return res.status(200).json({
        success: true,
        message: "Table data updated",
        data: existingData.toJSON(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error in updating table data: ${error.message}`,
      });
    }
  },
  // TableData API - Get table data by ID
  getTableDataById: async (req, res) => {
    try {
      const { id } = req.params; // Get the ID from the request params

      const tableData = await TableData.findById(id);
      if (!tableData) {
        return res.status(404).json({
          success: false,
          message: "Table data not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Table data fetched successfully",
        data: tableData.toJSON(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error in getting table data: ${error.message}`,
      });
    }
  },
  deleteTableData: async (req, res) => {
    try {
      const { id } = req.params; // Get the ID from the request params

      const tableData = await TableData.findByIdAndDelete(id);
      if (!tableData) {
        return res.status(404).json({
          success: false,
          message: "Table data not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Table data deleted successfully",
        data: tableData.toJSON(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error in deleting table data: ${error.message}`,
      });
    }
  },
};
module.exports = auth;
