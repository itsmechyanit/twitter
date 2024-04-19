const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: new Date(),
  },

  description: {
    type: String,
    required: [true, "Each Comment must have a text"],
  },

  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Comment must belong to a user"],
  },

  postedOn: {
    type: mongoose.Schema.ObjectId,
    ref: "Tweet",
    required: [true, "Comment must belong to a Tweet"],
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
