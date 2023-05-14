const mongoose = require("mongoose");

const ForgetPasswordSchema = mongoose.Schema(
  {
    resetCode: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Password Reset", ForgetPasswordSchema);
