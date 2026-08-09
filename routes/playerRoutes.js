const {
  getAllPlayers,
  getPlayerById,
  getRandomPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getMostViewedPlayer,
} = require("../controllers/playerController");
const playerRouter = require("express").Router();

playerRouter.get("/", getAllPlayers);
playerRouter.get("/random", getRandomPlayer);
playerRouter.get("/mostviewed", getMostViewedPlayer);

playerRouter.get("/:id", getPlayerById);
playerRouter.post("/", createPlayer);
playerRouter.patch("/:id", updatePlayer);
playerRouter.delete("/:id", deletePlayer);

module.exports = playerRouter;
