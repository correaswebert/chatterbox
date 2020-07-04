const express = require("express");
const router = express.Router();
const Group = require("../Models/Group");

router.post("/create", (req, res) => {
  const { name, avatar, timeCreated, creator, participants } = res.body;

  const group = new Group({
    name: name,
    // avatar:avatar,
    creator: creator,
    time_created: time,
    admins: [creator],
    participants: participants,
  });

  group.save((err, g) => {
    if (err)
      return res.status(200).send({
        error: err,
        success: false,
      });

    res.status(200).send({
      groupId: g._id,
      message: "Group successfully created",
      success: true,
    });
  });
});

module.exports = router;
