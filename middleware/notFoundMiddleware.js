function notFoundMiddleware(req, res) {
  return res.status(404).json({
    status: "FAILED",
    message: `Route not found: ${req.originalUrl}`,
  });
}

module.exports = notFoundMiddleware;
