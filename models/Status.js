const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
  status: String
});

module.exports = mongoose.model("Status", statusSchema);