const commentModel = require("../../models/products/CommentsModel");
class Comments {
  async setComments(req, res, next) {
    const { postId, comment } = req.body;
    const userId = req.userId;
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
      res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
  async allcomments(req, res, next) {
    try {
      const allComments = await commentModel.find();
      res.status(200).json({ success: true, data: allComments });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
  async getComments(req, res, next) {
    console.log(req.params.post_id);
    try {
      const allCommentsOfPost = await commentModel
        .find({
          postId: req.params.post_id,
        })
        .populate("userId");
      // .populate("postId");
      res.status(200).json({
        success: true,
        message: "found all comments of post",
        data: { allCommentsOfPost },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
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
