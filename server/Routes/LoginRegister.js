const express = require("express");
const router = express.Router();
const Person = require("../Models/Person");

router.post("/register", (req, res) => {
  // console.log(req);

  // FIX: add avatar once implemented
  const { name, phone } = req.body.userIdentification;

  const person = new Person({
    name: name,
    phone: phone,
    // avatar: avatar,
  });

  // check if phone exists in DB
  Person.findOne({ phone: phone }, (err, saved_person) => {
    if (err)
      return res.status(200).send({
        error: err,
        success: false,
      });

    // // DEBUG
    // console.log(saved_person);

    if (saved_person) {
      return res.status(200).send({
        error: "Phone number already registered",
        success: false,
      });
    }

    person.save((err, p) => {
      res.status(200).send({
        message: "Phone number successfully registered",
        success: true,
      });
    });
  });

  // DEBUG
  console.log(`name: ${name}, phone: ${phone}`);
});

router.post("/login", (req, res) => {
  const phone = req.body.registeredMobileNumber;

  // check if phone exists in DB
  Person.findOne({ phone: phone }, (err, saved_person) => {
    if (err)
      return res.status(200).send({
        error: err,
        success: false,
      });

    // // DEBUG
    // console.log(p);

    if (saved_person) {
      return res.status(200).send({
        message: "Logged in successfully",
        success: true,
      });
    }

    res.status(200).send({
      error: "Phone number not registered",
      success: false,
    });
  });
});

module.exports = router;
