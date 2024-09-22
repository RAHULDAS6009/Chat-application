const mongoose = require("mongoose");

//Message Schema
//sender,content,chat,readBy
const schema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
    content: { type: String, required:true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps:true }
);

const model = mongoose.model("Message", schema);
module.exports = model;
