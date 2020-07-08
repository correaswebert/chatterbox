const express = require("express");
const router = express.Router();
const { addUser, removeUser, getUser, getUsersInChat } = require("./users");

router.get("/", (req, res) => {
  res.send({ response: "Server is up and running." }).status(200);
});

router.post("/personal", (req, res) => {
  const chatId = req.body.chatId;

  // save this chatId

  res.status(200).send({
    message: "Created personal chat!",
    success: true,
  });
});

router.post("/group", (req, res) => {
  const chatId = req.body.chatId;

  // save this chatId

  res.status(200).send({
    message: "Entered group chat!",
    success: true,
  });
});

module.exports = router;
