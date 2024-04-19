const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  followee: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "follow must belong to a User"],
  },
  follower: {
    type: mongoose.Schema.ObjectId,
    ref: "Tweet",
    required: [true, "follow must belong to a User"],
  },
});

followSchema.index(
  {
    followee: 1,
    follower: 1,
  },
  {
    unique: true,
  }
);

const Follow = mongoose.model("Follow", followSchema);

module.exports = Follow;
