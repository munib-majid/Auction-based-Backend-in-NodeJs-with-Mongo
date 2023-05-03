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
      return res.send(ratingAvg);
      const ratings = await SellerRatingModel.find({
        sellerId: id,
      });
      let ratingAverage = null;
      let temp = null;
      for (let i in ratings) {
        temp += ratings[i].rating;
      }
      ratingAverage = temp / ratings.length;

      res.status(200).json({ success: true, data: ratingAverage });
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
        throw new Error("you cannot rate a buyer ");
      }
      // const alreadySubmittedRating = await SellerRatingModel.find({
      //   sellerId: sellerId,
      // });

      // for (let i in alreadySubmittedRating) {
      //   //checks for already existing userRating for seller
      //   if (userId == alreadySubmittedRating[i].userId) {
      //     ratings = alreadySubmittedRating[i]._id;
      //   }
      // }
      //if rating for seller with user already exists then it will update the old rating
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
