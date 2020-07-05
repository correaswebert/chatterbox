const express = require("express");
const router = express.Router();
const UserHandler = require("../Database/NewUser");

router.post("/register", (req, res) => {
  const { message, success } = UserHandler.createNewUser(req.body.userIdentification);
  res.status(200).send({ message, success });

  // DEBUG
  console.log(`name: ${name}, phone: ${phone}`);
});

router.post("/login", (req, res) => {
  const { message, success } = UserHandler.doesUserExist(req.body.registeredMobileNumber);
  res.status(200).send({ message, success });
});

module.exports = router;
