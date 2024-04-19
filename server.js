const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION: SHUTTING DOWN");
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION: SHUTTING DOWN");

  process.exit(1);
});

const app = require("./app");

const PORT = process.env.PORT || 3000;

const conString = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(conString).then(() => console.log("DB Connection Successful"));

app.listen(PORT, "127.0.0.1", () => {
  console.log(`server started listening on ${PORT}`);
});

// testTour
//   .save((doc) => console.log(doc))
//   .catch((err) => console.log('Error:⚡️', err));
// const dotenv = require('dotenv');
// const app = require('./app');

// dotenv.config({ path: './config.env' });⚡️

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });
