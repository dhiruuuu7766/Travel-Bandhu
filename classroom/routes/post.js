const express = require("express");
const router = express.Router();

//Index - posts
router.get("/", (req, res) => {
  res.send("Get route for posts");
});

//show - posts
router.get("//:id", (req, res) => {
  res.send("Get route for show posts");
});

//post - route - posts
router.post("/", (req, res) => {
  res.send("post route for posts");
});

//delete route for posts
router.delete("/", (req, res) => {
  res.send("delete route for posts");
});

module.exports = router;
