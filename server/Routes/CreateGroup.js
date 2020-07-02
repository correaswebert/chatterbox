const express = require("express");
const router = express.Router();
const Group = require("../Models/Group");

router.post("/create-group", (req, res) => {
  const meeting = new Group({
    group_name: req.body.name,
    // group_avatar:req.body.avatar,
    group_creator: req.body.creator,
    time_created: req.body.time,
    admins: [req.body.creator],
    participants: req.body.participants,
  });

  meeting
    .save()
    .then((res) => {
      res.status(200).send({
        msg: "Group successfully created",
        isSuccess: true,
      });
    })
    .catch((err) => {
      res.status(402).send({
        error: err,
        isSuccess: false,
      });
    });
});

router.post("/login", (req, res) => {
  console.log("Entered");
  Meeting.findOne({
    meeting_name: req.body.meeting_name,
    password: req.body.password,
  })
    .then((meet) => {
      console.log(meet);
      if (meet) {
        return res.status(200).send({
          msg: "User login success",
          isSuccess: true,
        });
      } else {
        return res.status(403).send({
          error: "Invalid username or password",
          isSuccess: false,
        });
      }
    })
    .catch((err) => {
      res.status(402).send({
        error: "Invalid username or password",
        isSuccess: false,
      });
    });
});

module.exports = router;
