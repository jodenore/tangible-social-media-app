const mongoose = require("mongoose");

function validateObjectId(paramName) {
  return function (req, res, next) {
    const id = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "FAILED",
        message: `Invalid ${paramName}`,
      });
    }

    next();
  };
}

module.exports = validateObjectId;
