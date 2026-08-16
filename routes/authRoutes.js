const authRouter = require("express").Router();

const { registerUser, loginUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

authRouter.get("/me", authMiddleware, (req, res) => {
  res.json({
    status: "SUCCESS",
    date: req.user,
  });
});

module.exports = authRouter;
