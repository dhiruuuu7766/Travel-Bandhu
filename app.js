if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const { default: MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;
const sessionSecret =
  process.env.SESSION_SECRET ||
  (process.env.NODE_ENV === "production"
    ? undefined
    : "development-only-session-secret");

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be configured in production.");
}

async function main() {
  if (!dbUrl) {
    console.warn(
      "ATLASDB_URL is not configured. Starting without a database connection.",
    );
    return;
  }

  await mongoose.connect(dbUrl);
  console.log("Connection to DB");
}

const sessionStore = dbUrl
  ? MongoStore.create({
      mongoUrl: dbUrl,
      crypto: {
        secret: sessionSecret,
      },
      touchAfter: 24 * 3600,
    })
  : new session.MemoryStore();

if (dbUrl) {
  sessionStore.on("error", (error) => {
    console.error("MongoDB session store error:", error.message);
  });
}

const port = Number(process.env.PORT) || 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));

const sessionOption = {
  store: sessionStore,
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.use("/demoUser", async (req, res) => {
  let fakeUser = new User({
    email: "studeTTnt@gmail.com",
    username: "sigFFma-student",
  });

  let registerdUser = await User.register(fakeUser, "helloworld");

  res.send(registerdUser);
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something was wrong" } = err;

  res.status(statusCode).render("error.ejs", { err });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is listening on ${port}`);
});

main().catch((err) => {
  console.error("MongoDB connection failed:", err.message);
});
