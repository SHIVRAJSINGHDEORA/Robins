if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodoverride = require("method-override");
const ExpressError = require("./utilis/ExpressError.js");
const path = require("path");
const port = 8080;
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const MONGO_URL = process.env.MONGO_URL;
const secret = process.env.SECRET

main()
  .then(() => {
    console.log("Connected to server");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.listen(port, () => {
  console.log("Server is listining on port 8080");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodoverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl : MONGO_URL,
  crypto : {
    secret : secret
  },
  touchAfter : 24 * 3600,
})

store.on("error", ()=>{
  console.log("Error occured in mongo store!", err);
})

const sessionOptions = {
  store,
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookies: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.cuurUser = req.user;
  next();
});

//listings
app.use("/listings", listingRouter);

//reviews
app.use("/listings/:id/reviews", reviewRouter);

//user
app.use("/", userRouter);

//error middlewares
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Some type of err" } = err;
  res.status(status).render("listings/error.ejs", { err });
});
