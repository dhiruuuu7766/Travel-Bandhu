const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const { name } = require("ejs");
const flash = require("connect-flash");
const path = require("path");
const { nextTick } = require("process");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOption = {
  secret: "secretcode",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOption));
app.use(flash());

//MIDDLEWARE TO AVOID REPETION AND BULKY CODE
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  if (name === "anonymous") {
    req.flash("error", "user is not registered");
  } else {
    req.flash("success", "user registered successfully");
  }
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  res.render("page.ejs", { name: req.session.name });
});

// app.get("/requestCount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`this is request ${req.session.count} times `);
// });

// app.get("/test", (req, res) => {
//   res.send("test successfull");
// });

app.listen(3000, () => {
  console.log("Server is listening to 3000");
});
