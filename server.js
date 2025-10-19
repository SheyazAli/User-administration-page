const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const path = require("path");
const connectdb = require("./db/connectdb");
const session = require("express-session");
const nocache = require("nocache");

//  View setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

//  Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//  Add session + nocache BEFORE routes
app.use(session({
  secret: process.env.SESSION_SECRET,          // change this to something random
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

app.use(nocache());

//  Routes (after session setup)
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

//  DB connection
connectdb();

//  Start server
const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server connected to ${port}`);
});
