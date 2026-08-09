const {
  getAllPosts,
  getPostById,
  fetchPostsByPlayerId,
  createPost,
  updatePost,
  deletePost,
  fetchPostsByAuthorId,
} = require("../controllers/postController");
const postRouter = require("express").Router();

postRouter.get("/", getAllPosts);
postRouter.get("/player/:playerId", fetchPostsByPlayerId);
postRouter.get("/author/:authorId", fetchPostsByAuthorId);
postRouter.get("/:id", getPostById);

postRouter.post("/", createPost);
postRouter.patch("/:id", updatePost);
postRouter.delete("/:id", deletePost);

module.exports = postRouter;
