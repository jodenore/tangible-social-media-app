const {
  createComment,
  getCommentById,
  fetchCommentsByPostId,
  getCommentsByAuthor,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
} = require("../controllers/commentController");
const commentRouter = require("express").Router();

commentRouter.post("/create", createComment);
commentRouter.get("/post/:postId", fetchCommentsByPostId);
commentRouter.get("/author/:authorId", getCommentsByAuthor);

commentRouter.get("/:id", getCommentById);
commentRouter.patch("/:id/like", likeComment);
commentRouter.patch("/:id/unlike", unlikeComment);
commentRouter.patch("/:id", updateComment);

commentRouter.delete("/:id", deleteComment);

module.exports = commentRouter;
