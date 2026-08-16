const { default: mongoose } = require("mongoose");
const Comment = require("../models/Comment");

async function getAllComments(req, res) {
  try {
    const comments = await Comment.find()
      .populate("author", "username displayName avatar")
      .populate("post", "content player");

    return res.json({
      status: "SUCCESS",
      data: comments,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function getCommentById(req, res) {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("author", "username displayName avatar")
      .populate("post", "content player");

    if (!comment) {
      return res.status(404).json({
        status: "FAILED",
        message: "Comment not found",
      });
    }

    return res.json({
      status: "SUCCESS",
      data: comment,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function fetchCommentsByPostId(req, res) {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "username displayName avatar")
      .populate("post", "content player");

    return res.json({
      status: "SUCCESS",
      data: comments,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function getCommentsByAuthor(req, res) {
  try {
    const comments = await Comment.find({ author: req.params.authorId })
      .populate("author", "username displayName avatar")
      .populate("post", "content player");

    return res.json({
      status: "SUCCESS",
      data: comments,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function createComment(req, res) {
  try {
    const comment = await Comment.create(req.body);

    const populatedComment = await comment.populate([
      {
        path: "author",
        select: "username displayName avatar",
      },
      {
        path: "post",
        select: "content player",
      },
    ]);

    return res.status(201).json({
      status: "SUCCESS",
      data: populatedComment,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function updateComment(req, res) {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("author", "username displayName avatar")
      .populate("post", "content player");

    if (!comment) {
      return res.status(404).json({
        status: "FAILED",
        message: "Comment not found",
      });
    }

    return res.json({
      status: "SUCCESS",
      data: comment,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function likeComment(req, res) {
  try {
    let { userId } = req.body;
    const { id } = req.params;

    // check if userId is provided
    if (!userId) {
      return res.status(400).json({
        status: "FAILED",
        message: "User ID is required",
      });
    }
    // mongoose isValid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid userID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid comment ID",
      });
    }

    userId = new mongoose.Types.ObjectId(userId);
    const comment = await Comment.findByIdAndUpdate(
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
    ).populate("likes", "username displayname bio avatar");

    if (!comment) {
      return res.status(404).json({
        status: "FAILED",
        message: "Comment not found",
      });
    }

    return res.json({
      status: "SUCCESS",
      data: comment,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function unlikeComment(req, res) {
  try {
    let { userId } = req.body;
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: "FAILED",
        message: "User ID is required",
      });
    }
    // mongoose isValid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid userID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid comment ID",
      });
    }

    userId = new mongoose.Types.ObjectId(userId);

    const comment = await Comment.findById(req.params.id);

    // check if id in likes if not 500
    if (!comment.likes.includes(userId)) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found in likes",
      });
    }

    comment.likes = comment.likes.filter((likeId) => !likeId.equals(userId));

    await comment.save();

    return res.json({
      status: "SUCCESS",
      data: comment,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function deleteComment(req, res) {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(404).json({
        status: "FAILED",
        message: "Comment not found",
      });
    }

    return res.json({
      status: "SUCCESS",
      message: "Comment deleted successfully",
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

module.exports = {
  getAllComments,
  getCommentById,
  fetchCommentsByPostId,
  getCommentsByAuthor,
  createComment,
  updateComment,
  unlikeComment,
  likeComment,
  deleteComment,
};
