require("dotenv").config({ quiet: true });
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("./db");

const User = require("./models/User");
const Bus = require("./models/Bus");
const Route = require("./models/route");
const Location = require("./models/Location");
const Status = require("./models/Status");
const Schedule = require("./models/Schedule");

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("JWT_SECRET is missing. Copy .env.example to .env and set it.");
  process.exit(1);
}

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) =>
     {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: "Incorrect email." });
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: "Incorrect password." });
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

app.use(passport.initialize());

function auth(req, res, next)
 {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  }
   catch
    {
    res.status(401).json({ message: "Invalid token" });
  }
}

function role(requiredRole) 
{
  return (req, res, next) =>
     {
    if (req.user.role !== requiredRole)
      return res.status(403).json({ message: "Access denied" });
    next();
  };
}

app.post("/api/auth/register", async (req, res) =>
   {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();
    res.json({ message: "User registered" });
  }
   catch (err)
    {
    res.status(400).json({ message: "Registration failed", error: err.message });
  }
});

app.post("/api/auth/login", (req, res, next) => 
  {
  passport.authenticate("local", { session: false }, (err, user, info) =>
     {
    if (err || !user)
       return res.status(400).json({ message: info?.message || "Login failed" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  })(req, res, next);
});

app.post("/api/auth/logout", auth, (req, res) =>
   {
  res.json({ message: "Logged out" });
});

app.get("/api/auth/profile", auth, async (req, res) => 
  {
  res.json(await User.findById(req.user.id).select("-password"));
});

app.get("/api/users", auth, role("admin"), async (req, res) =>
   {
  res.json(await User.find());
});

app.get("/api/users/:id", auth, role("admin"), async (req, res) => 
  {
  res.json(await User.findById(req.params.id));
});

app.put("/api/users/:id", auth, role("admin"), async (req, res) =>
   {
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "User updated" });
});

app.delete("/api/users/:id", auth, role("admin"), async (req, res) => 
  {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

app.post("/api/buses", auth, role("admin"), async (req, res) =>
   {
  res.json(await new Bus(req.body).save());
});

app.get("/api/buses", auth, async (req, res) => 
  {
  res.json(await Bus.find());
});

app.get("/api/buses/:id", auth, async (req, res) => 
  {
  res.json(await Bus.findById(req.params.id));
});

app.put("/api/buses/:id", auth, role("admin"), async (req, res) => 
  {
  await Bus.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Bus updated" });
});

app.delete("/api/buses/:id", auth, role("admin"), async (req, res) =>
   {
  await Bus.findByIdAndDelete(req.params.id);
  res.json({ message: "Bus deleted" });
});

app.post("/api/routes", auth, role("admin"), async (req, res) =>
   {
  res.json(await new Route(req.body).save());
});

app.get("/api/routes", auth, async (req, res) =>
   {
  res.json(await Route.find());
});

app.get("/api/routes/:id", auth, async (req, res) => 
  {
  res.json(await Route.findById(req.params.id));
});

app.put("/api/routes/:id", auth, role("admin"), async (req, res) =>
   {
  await Route.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Route updated" });
});

app.post("/api/location/update", auth, role("driver"), async (req, res) => 
  {
  res.json(await new Location(req.body).save());
});

app.get("/api/location/:busId", auth, async (req, res) => 
  {
  res.json(await Location.findOne({ busId: req.params.busId }).sort({ timestamp: -1 }));
});

app.get("/api/location/history/:busId", auth, async (req, res) =>
   {
  res.json(await Location.find({ busId: req.params.busId }));
});

app.post("/api/status/update", auth, role("driver"), async (req, res) => 
  {
  res.json(await new Status(req.body).save());
});

app.get("/api/status/:busId", auth, async (req, res) => 
  {
  res.json(await Status.findOne({ busId: req.params.busId }));
});

app.put("/api/status/:busId", auth, role("driver"), async (req, res) => 
  {
  await Status.findOneAndUpdate({ busId: req.params.busId }, req.body, { upsert: true });
  res.json({ message: "Status updated" });
});

app.post("/api/schedule", auth, role("admin"), async (req, res) =>
   {
  res.json(await new Schedule(req.body).save());
});

app.get("/api/schedule/:busId", auth, async (req, res) => 
  {
  res.json(await Schedule.findOne({ busId: req.params.busId }));
});

app.put("/api/schedule/:busId", auth, role("admin"), async (req, res) =>
   {
  await Schedule.findOneAndUpdate({ busId: req.params.busId }, req.body, { upsert: true });
  res.json({ message: "Schedule updated" });
});

app.listen(5000, () => 
  {
  console.log("Server running on port 5000");
});