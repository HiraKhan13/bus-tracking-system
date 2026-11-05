const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
  timings: [String]
});

module.exports = mongoose.model("Schedule", scheduleSchema);