const FavoritePostModel = require("../../models/products/FavoritePostOfUser");
class FavoritePost {
  async getFavoriteProductOfAUser(req, res, next) {
    try {
      const favoritePosts = await FavoritePostModel.find({
        userId: req.userId,
      }).populate("postId");
      return res.status(200).json({
        success: true,
        message: "Favorite Post of user fetched successfully",
        FavoritePosts: favoritePosts,
      });
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
  async setFavoritePost(req, res, next) {
    const { postId } = req.body;
    const userId = req.userId;
    try {
      const newFavoritePost = await FavoritePostModel.create({
        userId,
        postId,
      });
      return res.status(201).json({
        success: true,
        message: "The post is added to Favorites",
        data: newFavoritePost,
      });
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
  async removeFavoritePostByPostId(req, res, next) {
    const postId = req.params.post_id;
    try {
      const favoriteToBeRemoved = await FavoritePostModel.findOneAndDelete({
        userId: req.userId,
        postId: postId,
      });
      return res.status(201).json({
        success: true,
        message: "favorite removed",
        removedFavorite: favoriteToBeRemoved,
      });
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
  async removeFavoritePost(req, res, next) {
    const postId = req.params.post_id;
    try {
      const favoriteToBeRemoved = await FavoritePostModel.findByIdAndDelete({
        _id: postId,
      });
      return res.status(201).json({
        success: true,
        message: "favorite removed",
        removedFavorite: favoriteToBeRemoved,
      });
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = FavoritePost;
