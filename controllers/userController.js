const Tweet = require("../models/tweetModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Follow = require("../models/followModel");

const multer = require("multer");

const sharp = require("sharp");
const Like = require("../models/likeModel");
const Comment = require("../models/commentModel");

const storage = multer.memoryStorage();

const filter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    cb(new AppError("Not an image. Please upload the image again", 400));
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filter,
});

exports.uploadImage = upload.single("photo");

exports.resizeImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.body.username}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

exports.getProfile = (req, res, next) => {
  res.render("userProfile", { title: "User Profile" });
};

exports.getUsers = catchAsync(async (req, res, next) => {
  const searchFor = req.query.searchFor;
  if (!searchFor) {
    return res.redirect("/search");
  }
  const users = await User.find({
    name: {
      $regex: `^${searchFor}`,
      $options: "i",
    },
  });
  res.status(200).json({
    message: "success",
    users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const searchedUser = await User.findById(req.params.userId);
  const tweets = await Tweet.find({
    postedBy: req.params.userId,
  })
    .sort({ createdAt: -1 })
    .populate("postedBy");
  const tweetsLikedByLoggedInUser = [];
  const numCommentsOnEachTweet = [];

  const numFollowers = (
    await Follow.find({
      followee: req.params.userId,
    })
  ).length;

  const numFollowings = (
    await Follow.find({
      follower: req.params.userId,
    })
  ).length;

  const followedByLoggedInUser = await Follow.findOne({
    followee: req.params.userId,
    follower: req.user.id,
  });

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

  res.status(200).render("user", {
    title: "user details",
    tweets,
    tweetsLikedByLoggedInUser,
    numCommentsOnEachTweet,
    numFollowers,
    numFollowings,
    followedByLoggedInUser,
    searchedUser,
  });
});
