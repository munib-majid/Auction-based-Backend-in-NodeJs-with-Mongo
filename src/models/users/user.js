const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    dp: {
      type: String,
    },
    cnicFront: {
      type: String,
    },
    cnicBack: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
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
      unique: true,
      lowercase: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
    },
    role: {
      type: String,
      default: "buyer",
    },
    cnicNumber: {
      type: String,
    },
    currentCity: {
      type: String,
      required: true,
    },
    statusOfUser: {
      type: String,
      default: "You Can apply to become seller and wait for admin approval",
    },
    tryAgainToBecomeSeller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//time stamp will add two more feild in our databse created time and modified time

module.exports = mongoose.model("User", UserSchema);
