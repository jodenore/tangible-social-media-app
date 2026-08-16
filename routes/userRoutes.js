const userRouter = require("express").Router();

const {
  addFavouritePlayer,
  removeFavouritePlayer,
} = require("../controllers/playerController");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", createUser);
userRouter.patch("/:id/favourite-players/:playerId", addFavouritePlayer);
userRouter.patch("/:id", updateUser);

userRouter.delete("/:id/favourite-players/:playerId", removeFavouritePlayer);
userRouter.delete("/:id", deleteUser);

module.exports = userRouter;
