const SellerRatingModel = require("../../models/users/SellerRating");
class SellerRating {
  async getUserRating(req, res, next) {
    const id = req.params.seller_id;
    try {
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
      const alreadySubmittedRating = await SellerRatingModel.find({
        sellerId: sellerId,
      });

      let ratings = null;
      let newRating;
      for (let i in alreadySubmittedRating) {
        //checks for already existing userRating for seller
        if (userId == alreadySubmittedRating[i].userId) {
          ratings = alreadySubmittedRating[i]._id;
        }
      }
      //if rating for seller with user already exists then it will update the old rating
      if (ratings) {
        newRating = await SellerRatingModel.findByIdAndUpdate(
          {
            _id: ratings,
          },
          { rating: rating },
          { new: true }
        );
      } else {
        newRating = await SellerRatingModel.create({
          userId,
          sellerId,
          rating,
        });

        await newRating.save();
      }

      res.status(201).json({
        success: true,
        message: "rating was submitted successfully",
        data: newRating,
      });
    } catch (error) {
      res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }

  // async updateUserRating(req, res, next) {}

  // async deleteUserRating(req, res, next) {}
}
module.exports = SellerRating;
