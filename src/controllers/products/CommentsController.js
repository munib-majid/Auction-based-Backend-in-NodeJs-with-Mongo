const commentModel = require("../../models/products/CommentsModel");
class Comments {
  async setComments(req, res, next) {
    const { postId, userId, comment } = req.body;
    const newComment = await commentModel.create({
      postId,
      userId,
      comment,
    });
    try {
      await newComment.save();
      res.status(201).json({
        success: true,
        message: "comment posted successfully",
        data: { newComment },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "comment was not posted ",
        error: { error },
      });
    }
  }
  async getComments(req, res, next) {
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
  }
  async putComments(req, res, next) {
    const id = req.params.id;
    const newComment = { comment: comment };
    try {
      const commentToBeUpdated = await commentModel.findByIdAndUpdate(
        { _id: id },
        newComment,
        { new: true }
      );
      if (commentToBeUpdated != null) {
        res.status(201).json({
          success: true,
          message: "comment was updated successfully",
          data: commentToBeUpdated,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "comment was not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong",
        error,
      });
    }
  }
  async deleteComments(req, res, next) {
    const id = req.params.id;

    try {
      const commentToBeDeleted = await commentModel.findByIdAndRemove(id);
      if (commentToBeDeleted != null) {
        res.status(201).json({
          success: true,
          message: "comment was deleted successfully",
          data: { commentToBeDeleted },
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "comment was not found" });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong",
        error: { error },
      });
    }
  }
}
module.exports = Comments;
