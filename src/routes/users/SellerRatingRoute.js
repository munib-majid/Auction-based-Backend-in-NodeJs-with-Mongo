const RatingRouter = require("express").Router();
const auth = require("../../middlewares/auth");
const SellerRating = require("../../controllers/users/SellerRatingController");

const sellerRating = new SellerRating();

RatingRouter.get("/:seller_id", auth, sellerRating.getUserRating);

RatingRouter.post("/", auth, sellerRating.setUserRating);

// RatingRouter.put("/", auth, sellerRating.updateUserRating);

// RatingRouter.delete("/", auth, sellerRating.deleteUserRating);

module.exports = RatingRouter;
