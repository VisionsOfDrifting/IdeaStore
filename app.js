const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

// Add Environment Variables
require("dotenv").config();

// Load Models
require("./models/User");
require("./models/Idea");

// Passport Config
require("./config/passport")(passport);

// Load Routes
const index = require("./routes/index");
const auth = require("./routes/auth");
const ideas = require("./routes/ideas");

// Load Keys
const keys = require("./config/keys");

// Handlebars helper methods
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require("./helpers/hbs");

// Moongoose Connect
mongoose
  .connect(
    keys.mongoURI,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const app = express();

// Body-parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method-override Middleware
app.use(methodOverride("_method"));

// Handlebars Middleware
// You have to re-assign them in the helpers object
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      truncate: truncate,
      stripTags: stripTags,
      formatDate: formatDate,
      select: select,
      editIcon: editIcon
    },
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Use Routes
app.use("/", index);
app.use("/auth", auth);
app.use("/ideas", ideas);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
