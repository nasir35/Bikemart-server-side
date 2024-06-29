const errorHandler = (err, req, res, next) => {
  res.status(400).send({
    status: "fail",
    error: err.message,
  });
};

module.exports = errorHandler;
