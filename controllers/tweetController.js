const Tweet = require("../models/tweetModel");
const catchAsync = require("../utils/catchAsync");
const Like = require("../models/likeModel");
const Comment = require("../models/commentModel");

exports.getTweets = catchAsync(async (req, res, next) => {
  // const tweets = await Tweet.find({}, { $sort: { createdAt: -1 } }).populate(
  //   "postedBy"
  // );

  const tweets = await Tweet.find()
    .sort({ createdAt: -1 })
    .populate("postedBy");
  const tweetsLikedByLoggedInUser = [];
  const numCommentsOnEachTweet = [];

  for (let i = 0; i < tweets.length; i++) {
    const doc = await Like.findOne({
      likedBy: req.user.id,
      likedOn: tweets[i].id,
    });
    numCommentsOnEachTweet[i] = (
      await Comment.find({ postedOn: tweets[i].id })
    ).length;
    if (doc) {
      tweetsLikedByLoggedInUser[i] = true;
    } else {
      tweetsLikedByLoggedInUser[i] = false;
    }
  }

  res.status(200).render("tweets", {
    title: "tweets",
    tweets,
    tweetsLikedByLoggedInUser,
    numCommentsOnEachTweet,
  });
  // const tweets = res.render("tweets.ejs", {
  //   title: "tweets",
  // });
});

exports.postTweet = catchAsync(async (req, res, next) => {
  await Tweet.create({
    description: req.body.description,
    postedBy: req.user.id,
    createdAt: new Date(),
  });
  res.redirect("/tweets");
});

// exports.likeTweet = catchAsync(async (req, res, next) => {
//   const tweet = await Tweet.findById(req.params.tweetId);
//   if (tweet.likedByLoggedInUser) {
//     //unlike the tweet
//     tweet.numLikes = tweet.numLikes - 1;
//     tweet.likedByLoggedInUser = false;
//   } else {
//     tweet.numLikes = tweet.numLikes + 1;
//     tweet.likedByLoggedInUser = true;
//   }

//   await tweet.save();
//   res.redirect("/tweets");
// });
