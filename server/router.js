const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ response: "Server is up and running." }).status(200);
});

router.post("/register", (req, res) => {
  // console.log(req);
  const name = req.body.userIdentification.name;
  const phone = req.body.userIdentification.phone;
  // const avatar = req.body.userIdentification.avatar;

  // check if phone exists in DB
  console.log(`name: ${name}, phone: ${phone}`);
  res.send("OK").status(200);
});

module.exports = router;
