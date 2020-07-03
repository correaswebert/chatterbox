const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  name: String,
  phone: Number,
  // avatar: Buffer,
});

module.exports = mongoose.model("person", PersonSchema);
