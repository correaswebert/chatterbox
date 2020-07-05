const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhoneSocketSchema = new Schema({
  phone: Number,
  socket_id: String,
});

module.exports = mongoose.model("phone_socket", PhoneSocketSchema);
