const mongoose = require("mongoose");

const FavoriteSchema = mongoose.Schema(
  {
    postId: {
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
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Favorite", FavoriteSchema);
