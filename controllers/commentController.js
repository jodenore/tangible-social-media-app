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
  deleteComment,
};


