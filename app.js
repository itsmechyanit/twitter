const express = require("express");

const cookieParser = require("cookie-parser");

const path = require("path");

const AppError = require("./utils/appError");

const globalErrorController = require("./controllers/errorController");
const router = require("./routes/router");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", router);

app.all("*", (req, res, next) => {
  next(new AppError(`The resource ${req.originalUrl} does not exist`, 404));
});

app.use(globalErrorController);

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getATour);

// app.post('/api/v1/tours', createATour);

// app.patch('/api/v1/tours/:id', updateATour);

// app.delete('/api/v1/tours/:id', deleteATour);

module.exports = app;
