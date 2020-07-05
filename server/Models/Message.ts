const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({

    fromPhone: Number,
    fromName: String,

    toPhone?: Number,
    groupId?: String,

    type: String,
    payload: Object,
    time: Number,

    incoming: Boolean,
    group: Boolean,

});

module.exports = mongoose.model("message", MessageSchema);
