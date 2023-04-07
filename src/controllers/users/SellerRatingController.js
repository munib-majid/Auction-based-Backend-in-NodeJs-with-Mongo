const SellerRatingModel = require("../../models/users/SellerRating");
class SellerRating {
  async getUserRating(req, res, next) {}

  async setUserRating(req, res, next) {
    const { userId, sellerId, rating } = req.body;
    if (sellerId == userId) {
      res
        .status(500)
        .json({ success: false, message: "user cannot rate itself" });
    } else {
      try {
        const newRating = await SellerRatingModel.create({
          userId,
          sellerId,
          rating,
        });
        await newRating.save();
        res.status(201).json({
          success: true,
          message: "rating was submitted successfully",
          data: newRating,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "rating was not submitted ",
          error: error,
        });
      }
    }
  }

  async updateUserRating(req, res, next) {}

  async deleteUserRating(req, res, next) {}
}
module.exports = SellerRating;
