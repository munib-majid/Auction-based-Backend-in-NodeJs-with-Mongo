const mongoose = require("mongoose");

const ImageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      data: Buffer, //our image will save in binary data that is bufferr
      contentType: String, //
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", ImageSchema);
