const SellerRatingModel = require("../../models/users/SellerRating");
const UserModel = require("../../models/users/user");
const mongoose = require("mongoose");
class SellerRating {
  async getUserRating(req, res, next) {
    const id = req.params.seller_id;
    // console.log({ id });
    try {
      const ratingAvg = await SellerRatingModel.aggregate([
        {
          $match: {
            sellerId: new mongoose.Types.ObjectId(id), //aik seller ka data aye ga
          },
        },
        {
          $group: {
            _id: "$sellerId", //pipelines id
            avgRating: { $avg: "$rating" },
          },
        },
      ]);
      console.log(ratingAvg);
      return res.status(200).json({
        success: true,
        message: "Rating of seller fetched successfully.",
        data: ratingAvg,
      });
    } catch (error) {
      res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }

  async setUserRating(req, res, next) {
    const { sellerId, rating } = req.body;
    const userId = req.userId;

    try {
      if (sellerId == userId) {
        throw new Error("user cannot rate itself");
      }
      const sellerCheck = await UserModel.findOne({ _id: sellerId });
      if (sellerCheck.role != "seller") {
        throw new Error("You cannot rate a buyer.");
      }

      const newRating = await SellerRatingModel.findOneAndUpdate(
        {
          sellerId,
          userId,
        },
        { rating: rating },
        { new: true, upsert: true }
      );

      await newRating.save();

      return res.status(201).json({
        success: true,
        message: "rating was submitted successfully",
        data: newRating,
      });
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }

  // async updateUserRating(req, res, next) {}

  // async deleteUserRating(req, res, next) {}
}
module.exports = SellerRating;
