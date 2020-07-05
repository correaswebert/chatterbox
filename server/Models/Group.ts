import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: String,
  // avatar: Buffer,
  creator: Number, // phone number
  time_created: Number,

  // BUG: we have to define the Array as Person Schema...
  admins: Array,
  participants: Array,
});

module.exports = mongoose.model("group", GroupSchema);
