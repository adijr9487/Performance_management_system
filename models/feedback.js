const mongoose = require("mongoose");
var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
const schema = mongoose.Schema({
  author: { type: String, required: true },
  code: { type: String, required: true },
  date: { type: Date, required: true },
  linkEndPoint: { type: String, required: false },
  questionData: [
    {
      options: [
        {
          type: String,
          required: false,
        },
      ],
      q_statement: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        required: false,
      },
    },
  ],
  topic: { type: String },
  user_uid: {
    type: String,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
});

module.exports = mongoose.model("Feedback", schema);
