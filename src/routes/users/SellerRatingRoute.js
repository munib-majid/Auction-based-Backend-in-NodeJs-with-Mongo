const RatingRouter = require("express").Router();

const SellerRating = require("../../controllers/users/SellerRatingController");

const sellerRating = new SellerRating();

RatingRouter.get("/", sellerRating.getUserRating);

RatingRouter.post("/", sellerRating.setUserRating);

RatingRouter.put("/", sellerRating.updateUserRating);

RatingRouter.delete("/", sellerRating.deleteUserRating);

module.exports = RatingRouter;
