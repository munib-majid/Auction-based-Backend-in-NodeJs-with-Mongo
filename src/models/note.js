const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, //this will store the object id of the user that has saved his note
      ref: "User", // yeh khud ki asani k liye hai k yeh kiska ref hai
      required: true,
    },
  },
  { timestamps: true }
);

//time stamp will add two more feild in our databse created time and modified time

module.exports = mongoose.model("Note", NoteSchema);
