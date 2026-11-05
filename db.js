const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/UCP");

const db = mongoose.connection;

db.on("connected", () =>
   {
  console.log("MongoDB is connected");
});

db.on("error", () =>
   {
  console.log("MongoDB connection error");
});

db.on("disconnected", () => 
  {
  console.log("MongoDB is disconnected");
});

module.exports = db;