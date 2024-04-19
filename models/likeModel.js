const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  likedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Like must belong to a user"],
  },
  likedOn: {
    type: mongoose.Schema.ObjectId,
    ref: "Tweet",
    required: [true, "Like must belong to a Tweet"],
  },
});

likeSchema.index(
  {
    likedBy: 1,
    likedOn: 1,
  },
  {
    unique: true,
  }
);

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
