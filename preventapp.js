require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const helmet = require("helmet");
const { options, connection } = require("./db/db");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const flash = require("express-flash");
const passport = require("passport");
const adminRouter = require("./routes/admin");
const indexRouter = require("./routes/index");






const app = express();
app.use(
  helmet({
    hidePoweredBy: true,
  })
);

//Passport
require("./auth/passport")(passport);
//Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//Static folder
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/picUploads"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "user_session",
    store: new MySQLStore(options, connection),
  //   cookie: {
 
  //     // Session expires after 1 min of inactivity.
  //     expires: 60000
  // }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//View Engine Middleware
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.err_msg = req.flash("err_msg");
  res.locals.error = req.flash("error");
  next();
});


//routes
app.use("/", indexRouter);
app.use("/admin", adminRouter);

const PORT = process.env.PORT || 2700;
app.listen(PORT, (err) => {
  if (err) {
    console.log("There was an error running the server");
  } else {
    console.log(`Server running on http://localhost:${PORT}`);
  }
});
