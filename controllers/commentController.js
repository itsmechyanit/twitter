const Comment = require("../models/commentModel");
const Tweet = require("../models/tweetModel");
const catchAsync = require("../utils/catchAsync");

exports.getComments = catchAsync(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.tweetId).populate("postedBy");
  const comments = await Comment.find({
    postedOn: req.params.tweetId,
  })
    .sort({ createdAt: -1 })
    .populate("postedBy");

  res.status(200).render("comments", {
    comments,
    title: "All comments on this tweet",
    tweetId: req.params.tweetId,
    tweet,
  });
});

exports.postComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.create({
    description: req.body.description,
    postedBy: req.user.id,
    postedOn: req.params.tweetId,
    createdAt: new Date(),
  });

  res.redirect(`/comments/${req.params.tweetId}`);
});
