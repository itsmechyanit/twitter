const express = require("express");

const authController = require("../controllers/authController");

const userController = require("../controllers/userController");

const router = express.Router();

const tweetController = require("../controllers/tweetController");

const likeController = require("../controllers/likeController");
const commentController = require("../controllers/commentController");

const searchController = require("../controllers/searchController");

const followController = require("../controllers/followController");

router.get("/", authController.protect, (req, res, next) => {
  res.redirect("/tweets");
});

router.get("/login", (req, res, next) => {
  res.render("login", { title: "login" });
});

router.get("/register", (req, res, next) => {
  res.render("register", {
    title: "register",
  });
});

router.post(
  "/login",
  userController.uploadImage,
  userController.resizeImage,
  authController.login
);

router.post(
  "/register",
  userController.uploadImage,
  userController.resizeImage,
  authController.register
);

router.patch(
  "/updateMe",
  authController.protect,
  userController.uploadImage,
  userController.resizeImage,
  authController.updateMe
);

router.get("/tweets", authController.protect, tweetController.getTweets);
router.post("/tweets", authController.protect, tweetController.postTweet);

router.get("/profile", authController.protect, userController.getProfile);
router.get("/logout", authController.protect, authController.logout);
router.get("/likes/:tweetId", authController.protect, likeController.likeTweet);
router.get(
  "/comments/:tweetId",
  authController.protect,
  commentController.getComments
);
router.post(
  "/comments/:tweetId",
  authController.protect,
  commentController.postComment
);

router.get("/search", authController.protect, searchController.getSearchPage);
router.get("/searchUsers", authController.protect, userController.getUsers);
router.get("/users/:userId", authController.protect, userController.getUser);
router.get(
  "/follows/:userId",
  authController.protect,
  followController.followUser
);
module.exports = router;
