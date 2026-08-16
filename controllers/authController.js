const bcrypt = require("bcrypt");

const User = require("../models/User");
const createToken = require("../utils/createToken");

function createSafeUser(user) {
  const safeUser = user.toObject();
  delete safeUser.passwordHash;
  return safeUser;
}

async function registerUser(req, res) {
  try {
    const {
      username,
      displayName,
      email,
      password,
      avatar,
      bio,
      favouritePlayers,
    } = req.body;

    if (!username || !displayName || !email || !password) {
      return res.status(400).json({
        status: "FAILED",
        message: "username, displayName, email, and password are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        status: "FAILED",
        message: "A user with that email or username already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      displayName,
      email,
      passwordHash,
      avatar,
      bio,
      favouritePlayers,
    });

    const token = createToken(user._id);

    return res.status(201).json({
      status: "SUCCESS",
      data: {
        user: createSafeUser(user),
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "FAILED",
        message: "email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: "FAILED",
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        status: "FAILED",
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id);

    return res.json({
      status: "SUCCESS",
      data: {
        user: createSafeUser(user),
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
};
