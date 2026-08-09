const User = require("../models/User");
const bcrypt = require("bcrypt");
async function getAllUsers(req, res) {
  try {
    const users = await User.find().populate("favouritePlayers");
    if (!users) {
      return res.status(404).json({
        status: "FAILED",
        message: "No users found",
      });
    }
    return res.json({
      status: "SUCCESS",
      data: users,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function getUserById(req, res) {
  try {
    const users = await User.findById(req.params.id).populate(
      "favouritePlayers",
    );
    if (!users) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
    }
    return res.json({
      status: "SUCCESS",
      data: users,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function createUser(req, res) {
  try {
    const {
      username,
      displayName,
      favouritePlayers,
      email,
      password,
      avatar,
      bio,
    } = req.body;

    if (!password) {
      return res.status(400).json({
        status: "FAILED",
        message: "Password is required",
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      displayName,
      email,
      passwordHash,
      avatar,
      favouritePlayers,
      bio,
    });

    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    return res.status(201).json({
      status: "Success",
      data: userResponse,
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

async function updateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
    }
    res.json({
      status: "SUCCESS",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
    }
    res.json({
      status: "SUCCESS",
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
