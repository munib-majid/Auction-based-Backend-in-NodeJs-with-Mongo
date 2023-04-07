const Comments = require("../../controllers/products/CommentsController");
const CommentsRouter = require("express").Router();

const comment = new Comments();

CommentsRouter.post("/", comment.setComments);
CommentsRouter.get("/", comment.getComments);
CommentsRouter.put("/:id", comment.putComments);
CommentsRouter.delete("/:id", comment.deleteComments);

module.exports = CommentsRouter;
