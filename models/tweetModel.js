const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: new Date(),
  },

  description: {
    type: String,
    required: [true, "Each Tweet must have a text"],
  },

  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Tweet must belong to a user"],
  },
  numLikes: {
    type: Number,
    default: 0,
  },
  // likedByLoggedInUser: {
  //   type: Boolean,
  //   default: false,
  // },
});

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
