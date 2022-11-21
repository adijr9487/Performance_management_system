const mongoose = require("mongoose");

const schema = mongoose.Schema({
  answer_data: [{ type: String }],
  feedback_uid: { type: String, required: true },
  user_uid:{type:String},
  status: { type: String, default: "unsubmitted" },
  type: { type: String, required: true },
  username: { type: String, default: "No Name" },
});

module.exports = mongoose.model("Response", schema);
