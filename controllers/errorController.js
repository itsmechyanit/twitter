const AppError = require("../utils/appError");

function handleCastErrorDb(err) {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
}

function handleDuplicateValueErrorDb(err) {
  // const message = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  // console.log(message);

  const key = Object.keys(err.keyValue)[0];
  const value = err.keyValue[key];
  // const value = err.keyValue.name;
  // const message = `${key}: ${value} already taken. Please provide another value`;
  const message = `${value} already exists. Please provide another ${key}`;
  // const message = `Duplicate value found ${value}. Please provide another value`;
  return new AppError(message, 400);
}

function handleValidationErrorDb(err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data. ${errors.join(". ")}`;
  return new AppError(message, 400);
}

function handleJWTWebTokenError() {
  return new AppError("Invalid Token. Please login again", 401);
}
function handleJWTTokenExpiry() {
  return new AppError("The token has expired, Please login again", 401);
}

function sendError(err, req, res) {
  //The errors that we are aware of
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  //The errors that we don't want others to see
  if (!err.isOperational) {
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
}

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err, name: err.name, message: err.message };

  if (error.name === "CastError") error = handleCastErrorDb(error);
  if (error.code === 11000) error = handleDuplicateValueErrorDb(error);
  if (error.name === "ValidationError") error = handleValidationErrorDb(error);
  if (error.name === "JsonWebTokenError") error = handleJWTWebTokenError();
  if (error.name === "TokenExpiredError") error = handleJWTTokenExpiry();

  sendError(error, req, res);
};
