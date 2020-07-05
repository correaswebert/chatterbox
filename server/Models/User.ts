const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  phone: Number,
  // avatar: Buffer,
});

module.exports = mongoose.model("user", UserSchema);
