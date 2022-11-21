const mongoose = require("mongoose");

const schema = mongoose.Schema({
  email: { type: String,
    unique:true,
  },
  friend: [{ type: String }],
  name: { type: String },
  password: { type: String, required: true },
  pending: [{ type: String }],
  requested: [{ type: String }],
});

module.exports = mongoose.model("Useradditionaldata", schema);
