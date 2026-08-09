const Player = require("../models/Player");

async function getAllPlayers(req, res) {
  try {
    const players = await Player.find();
    return res.json({
      status: "SUCCESS",
      data: players,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function getPlayerById(req, res) {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        status: "FAILED",
        message: "Player not found",
      });
    }

    return res.json({
      status: "SUCCESS",
      data: player,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function getRandomPlayer(req, res) {
  try {
    const player = await Player.aggregate([{ $sample: { size: 1 } }]);

    if (!player) {
      return res.status(404).json({
        status: "FAILED",
        message: "Player not found",
      });
    }
    return res.json({
      status: "SUCCESS",
      data: player,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function getMostViewedPlayer(req, res) {
  try {
    const player = await Player.findOne({}, null, { sort: { views: -1 } });
    if (!player) {
      return res.status(404).json({
        status: "FAILED",
        message: "Player not found",
      });
    }

    return res.json({
      status: "SUCCESS",
      data: player,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function createPlayer(req, res) {
  try {
    const player = await Player.create(req.body);
    return res.status(201).json({
      status: "SUCCESS",
      data: player,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function updatePlayer(req, res) {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!player) {
      return res.status(404).json({
        status: "FAILED",
        message: "Player not found",
      });
    }
    res.json({
      status: "SUCCESS",
      data: player,
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

async function deletePlayer(req, res) {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);

    if (!player) {
      return res.status(404).json({
        status: "FAILED",
        message: "Player not found",
      });
    }
    res.json({
      status: "SUCCESS",
      message: "Player deleted successfully",
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: e.message,
    });
  }
}

module.exports = {
  getAllPlayers,
  getPlayerById,
  getRandomPlayer,
  getMostViewedPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
};

