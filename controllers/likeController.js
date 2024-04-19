const catchAsync = require("../utils/catchAsync");
const Like = require("../models/likeModel");
const Tweet = require("../models/tweetModel");

exports.likeTweet = catchAsync(async (req, res, next) => {
  let tweet;
  //check if the tweet is already liked
  let like = await Like.findOne({
    likedBy: req.user.id,
    likedOn: req.params.tweetId,
  });

  if (like) {
    //delete it from the collection
    await Like.deleteOne({
      likedBy: req.user.id,
      likedOn: req.params.tweetId,
    });
    tweet = await Tweet.findById(req.params.tweetId);
    tweet.numLikes = tweet.numLikes - 1;
    // tweet.likedByLoggedInUser = false;
    await tweet.save();
    return res.redirect("back");
  }

  //insert it into the database
  like = await Like.create({
    likedBy: req.user.id,
    likedOn: req.params.tweetId,
  });
  tweet = await Tweet.findById(req.params.tweetId);
  tweet.numLikes = tweet.numLikes + 1;
  // tweet.likedByLoggedInUser = true;
  await tweet.save();

  res.redirect("back");
});
