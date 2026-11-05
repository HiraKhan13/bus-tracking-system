const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  startPoint: String,
  endPoint: String,
  stops: [String]
});

module.exports = mongoose.model("route", routeSchema);