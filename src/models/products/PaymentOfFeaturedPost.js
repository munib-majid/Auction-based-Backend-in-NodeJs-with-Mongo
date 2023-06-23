const mongoose = require("mongoose");

const PaymentScreenshotSchema = mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    paymentScreenShot: {
      type: String,
      required: true,
    },
    approvedStatus: {
      type: Boolean,
      default: false,
    },
    approvedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentScreenshotSchema);
