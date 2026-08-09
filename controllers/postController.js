const Post = require("../models/Post");

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find()
      .populate("author", "username displayName avatar")
      .populate("player", "fullName slug sport position currentTeam image");

    return res.json({
      status: "SUCCESS",
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username displayName avatar")
      .populate("player", "fullName slug sport position currentTeam image");

    if (!post) {
      return res.status(404).json({
        status: "FAILED",
        message: "Post not found",
      });
    }

    return res.json({
      status: "SUCCESS",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

async function fetchPostsByPlayerId(req, res) {
  try {
    const posts = await Post.find({ player: req.params.playerId })
      .populate("author", "username displayName avatar")
      .populate("player", "fullName slug sport position currentTeam image");

    return res.json({
      status: "SUCCESS",
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

async function fetchPostsByAuthorId(req, res) {
  try {
    const posts = await Post.find({ author: req.params.authorId })
      .populate("author", "username displayName avatar")
      .populate("player", "fullName slug sport position currentTeam image");

    return res.json({
      status: "SUCCESS",
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

async function createPost(req, res) {
  try {
    const post = await Post.create(req.body);

    const populatedPost = await post.populate([
      {
        path: "author",
        select: "username displayName avatar",
      },
      {
        path: "player",
        select: "fullName slug sport position currentTeam image",
      },
    ]);

    return res.status(201).json({
      status: "SUCCESS",
      data: populatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

async function updatePost(req, res) {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("author", "username displayName avatar")
      .populate("player", "fullName slug sport position currentTeam image");

    if (!post) {
      return res.status(404).json({
        status: "FAILED",
        message: "Post not found",
      });
    }

    return res.json({
      status: "SUCCESS",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

async function deletePost(req, res) {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: "FAILED",
        message: "Post not found",
      });
    }

    return res.json({
      status: "SUCCESS",
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

module.exports = {
  getAllPosts,
  getPostById,
  fetchPostsByPlayerId,
  fetchPostsByAuthorId,
  createPost,
  updatePost,
  deletePost,
};
