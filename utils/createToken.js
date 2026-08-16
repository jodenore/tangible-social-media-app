const jwt = require("jsonwebtoken");

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

module.exports = createToken;
let text =
  "Max Dowman is a great player, he is an upcoming talent from Hale End, he is a great player and he is a great player";
