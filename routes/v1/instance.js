const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    msg: "Default Page!",
  });
});

router.get("/home", (req, res) => {
  return res.status(200).json({
    msg: "Welcome Home!",
  });
});

module.exports = router;
