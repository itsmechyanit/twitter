const catchAsync = require("../utils/catchAsync");
const Follow = require("../models/followModel");
const AppError = require("../utils/appError");
//const Tweet = require("../models/tweetModel");

exports.followUser = catchAsync(async (req, res, next) => {
  //check if user tries to follow himself
  if (req.params.userId === req.user.id) {
    return next(new AppError("You cannot follow yourself", 400));
  }
  //check if the loggedinuser already follows the searchedUser
  let follows = await Follow.findOne({
    followee: req.params.userId,
    follower: req.user.id,
  });

  if (follows) {
    //delete it from the collection
    await Follow.deleteOne({
      followee: req.params.userId,
      follower: req.user.id,
    });

    return res.status(201).json({
      status: "success",
    });
  }

  //insert it into the database
  follows = await Follow.create({
    followee: req.params.userId,
    follower: req.user.id,
  });

  return res.status(201).json({
    status: "success",
  });
});
