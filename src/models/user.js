const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    image: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
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

//time stamp will add two more feild in our databse created time and modified time

module.exports = mongoose.model("User", UserSchema);
