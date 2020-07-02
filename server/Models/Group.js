const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  group_name: {
    type: String,
    required: true,
  },
  // group_avatar: {
  //     type: Buffer,
  // },
  group_creator: {
    type: Number, // phone number
    required: true,
  },
  time_created: {
    type: Number,
    required: true,
  },
  admins: {
    type: Object,
  },
  participants: {
    type: Object,
  },
});

module.exports = mongoose.model("meetings", GroupSchema);
