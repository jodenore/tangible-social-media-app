const { default: mongoose } = require("mongoose");
const Post = require("../models/Post");

async function getAllPosts(req, res) {
  try {
    const { search, sport, sortBy } = req.query;
    let posts = await Post.find()
      .populate("author", "username displayName avatar")
      .populate("player", "fullName slug sport position currentTeam image");

    // Filter by sport if provided - radio buttons
    if (sport) {
      posts = posts.filter((post) => post?.player?.sport === sport);
    }
    if (search) {
      posts = posts.filter((post) =>
        post.content.toLowerCase().includes(search),
      );
    }

    // Sorting logic
    if (sortBy) {
      if (sortBy.toLowerCase() === "latest") {
        posts.sort((a, b) => b.createdAt - a.createdAt);
      }
      if (sortBy.toLowerCase() === "oldest") {
        posts.sort((a, b) => a.createdAt - b.createdAt);
      }
      if (sortBy.toLowerCase() === "likes") {
        posts.sort((a, b) => b.likes.length - a.likes.length);
      }
    }

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
      data: req.body.player ? populatedPost : post,
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

// added likePost and unlikePost functions

async function likePost(req, res) {
  // finds user id and pushes it to the likes array
  let { userId } = req.body;
  // post id
  const { id } = req.params;

  if (!userId) {
    return res.status(400).json({
      status: "FAILED",
      message: "userId is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      status: "FAILED",
      message: "Invalid userId",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "FAILED",
      message: "Invalid postId",
    });
  }

  userId = new mongoose.Types.ObjectId(userId);
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: {
        likes: userId,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

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
}

async function unlikePost(req, res) {
  try {
    //
    let { userId } = req.body;
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: "FAILED",
        message: "userId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid userId",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid post id",
      });
    }

    userId = new mongoose.Types.ObjectId(userId);

    const post = await Post.findByIdAndUpdate(
      id,
      {
        $pull: {
          likes: userId,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

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
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
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
  likePost,
  unlikePost,
  deletePost,
};
