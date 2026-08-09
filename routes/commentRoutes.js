const {
  createComment,
  getCommentById,
  fetchCommentsByPostId,
  getCommentsByAuthor,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const commentRouter = require("express").Router();

commentRouter.post("/create", createComment);
commentRouter.get("/post/:postId", fetchCommentsByPostId);
commentRouter.get("/:id", getCommentById);
commentRouter.get("/author/:authorId", getCommentsByAuthor);
commentRouter.patch("/:id", updateComment);
commentRouter.delete("/:id", deleteComment);

module.exports = commentRouter;
