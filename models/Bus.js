const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busNumber: String,
  capacity: Number
});

module.exports = mongoose.model("Bus", busSchema);