const mongoose = require("mongoose");

const BidsAgainstPostSchema = mongoose.Schema(
  {
    bidingPrice: {
      type: Number,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerBid", BidsAgainstPostSchema);
