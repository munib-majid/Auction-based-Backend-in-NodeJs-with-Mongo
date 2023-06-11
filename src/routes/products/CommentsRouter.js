const Comments = require("../../controllers/products/CommentsController");
const CommentsRouter = require("express").Router();
const auth = require("../../middlewares/auth");

const comment = new Comments();

CommentsRouter.post("/", auth, comment.setComments);
CommentsRouter.get("/:post_id", comment.getComments);
CommentsRouter.get("/", comment.allcomments);
CommentsRouter.put("/:id", auth, comment.putComments);
CommentsRouter.delete("/:id", auth, comment.deleteComments);

module.exports = CommentsRouter;
