const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const playerRouter = require("./routes/playerRoutes");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const app = express();

// Body parser

app.use(express.json());

// CORS
app.use(cors("dev"));

// Morgan

app.use(morgan());

// Health Check route.

app.get("/", (req, res) => {
  res.json({
    status: "SUCCESS",
    app: "Tangible",
    message: "API is currently up and running.",
  });
});

app.use("/api/players", playerRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

module.exports = app;
