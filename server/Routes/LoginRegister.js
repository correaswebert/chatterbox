const express = require("express");
const router = express.Router();
// const LoginRegister = require("../Models/LoginRegister");

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
  res.send({ error: null }).status(200);
});

router.post("/login", (req, res) => {
  const phone = req.body.registeredMobileNumber;

  // check if RMN in DB

  // send appropriate response
  res.send({ error: null }).status(200);
});

module.exports = router;

// router.post("/register", (req, res) => {
//   const meeting = new Meeting({
//     meeting_name: req.body.meeting_name,
//     password: req.body.password,
//     meeting_time: req.body.meeting_time
//   });

//   Meeting.findOne({ meeting_name: req.body.meeting_name }).then(meet => {
//     console.log(meet);
//     if (meet) {
//       return res.status(402).send({
//         error: "Meeting name already exists",
//         isSuccess: false
//       });
//     } else {
//       meeting
//         .save()
//         .then(res => {
//           res.status(200).send({
//             msg: "Meeting successfully created",
//             isSuccess: true
//           });
//         })
//         .catch(err => {
//           res.status(402).send({
//             error: err,
//             isSuccess: false
//           });
//         });
//     }
//   });
// });
