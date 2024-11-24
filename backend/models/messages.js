const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String, // Username or ID of the sender
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;