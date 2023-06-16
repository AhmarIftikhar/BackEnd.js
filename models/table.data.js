const mongoose = require("mongoose");

const tableDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  department: { type: String, required: true },
  status: { type: String, required: true },
  position: { type: String, required: true },
});

module.exports = mongoose.model("TableData", tableDataSchema);
