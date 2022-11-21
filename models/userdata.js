const mongoose = require("mongoose");

const schema = mongoose.Schema({
  feedback: [{ type: String }],
  name: { type: String, required: true },
  password: { type: String, required: true },
  response: [{ type: String }],
});

module.exports = mongoose.model("Userdata", schema);
