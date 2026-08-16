const {
  getAllPosts,
  getPostById,
  fetchPostsByPlayerId,
  createPost,
  updatePost,
  deletePost,
  fetchPostsByAuthorId,
  likePost,
  unlikePost,
} = require("../controllers/postController");
const postRouter = require("express").Router();
// validate param middleware
const validateObjectId = require("../middleware/validateObjectId");

// protect post routes
const authMiddleware = require("../middleware/authMiddleware");

postRouter.get("/", getAllPosts);
postRouter.get(
  "/player/:playerId",
  validateObjectId("playerId"),
  fetchPostsByPlayerId,
);
postRouter.get(
  "/author/:authorId",
  validateObjectId("authorId"),
  fetchPostsByAuthorId,
);
postRouter.get("/:id", validateObjectId("id"), getPostById);

// protected routes
postRouter.use(authMiddleware);

postRouter.post("/", createPost);
postRouter.patch("/:id/like", validateObjectId("id"), likePost);
postRouter.patch("/:id/unlike", validateObjectId("id"), unlikePost);
postRouter.patch("/:id", validateObjectId("id"), updatePost);

postRouter.delete("/:id", validateObjectId("id"), deletePost);

module.exports = postRouter;
