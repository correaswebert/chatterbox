const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhoneSocketSchema = new Schema({
  phone: {
    type: Number,
    required: true,
  },
  socket_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("phone_socket", PhoneSocketSchema);
