const express = require("express");
const router = express.Router();
const GroupHandler = require("../Database/Group");

router.post("/create", (req, res) => {
  const { group_id, message, success } = GroupHandler.createGroup(
    req.body.groupInformation
  );
  res.status(200).send({ group_id, message, success });
});

router.post("/add", (req, res) => {
  const { message, success } = GroupHandler.addUser(req.body.updateInformation);
  res.status(200).send({ message, success });
});

module.exports = router;
