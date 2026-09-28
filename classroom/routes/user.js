const express = require("express");
const router = express.Router();

//Index - Users
router.get("/", (req, res) => {
  res.send("Get route for user");
});

//show - users
router.get("/:id", (req, res) => {
  res.send("Get route for show posts");
});

//post - route - users
router.post("/", (req, res) => {
  res.send("post route for users");
});

//delete route for users
router.delete("/", (req, res) => {
  res.send("delete route for users");
});

module.exports = router;
