const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

function signToken(id) {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
}

function createSendToken(user, statusCode, res) {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
  };
  //if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}

exports.register = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.photo = req.file.filename;
  }

  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide username and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Invalid username or password", 401));
  }
  //check if the provided password is correct
  const isValid = await user.correctPassword(password, user.password);
  if (!isValid) {
    return next(new AppError("Invalid username or password", 401));
  }
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //check if the user has a token
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.redirect("/login");
  }
  //check if the token is valid
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if the user exists in the database
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user associated with this token does not exist", 401)
    );
  }
  //check if the user changed the password after getting a token
  if (currentUser.passwordChangedAfterToken(decoded.iat)) {
    return res.redirect("/login");
  }
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.logout = (req, res, next) => {
  // res.cookie("jwt", "dummycookie", {
  //   expiresIn: new Date(Date.now() + 1 * 1000),
  //   httpOnly: true,
  // });
  // res.status(204).json({
  //   status: "success",
  // });
  res.clearCookie("jwt");
  res.status(204).json({
    status: "success",
  });
};

// exports.updateMe = catchAsync(async (req, res, next) => {
//   console.log(req.body);
//   const userData = {};

//   const fields = Object.keys(req.body).filter(
//     (field) => field !== "currentPassword" || field !== "newPassword"
//   );
//   for (const key of fields) {
//     userData[key] = req.body[key];
//   }

//   if (req.file) {
//     userData.photo = req.file.filename;
//   }

//   console.log(req.user);

//   const user = await User.findByIdAndUpdate(req.user._id, userData, {
//     new: true,
//     runValidators: true,
//   }).select("+password");

//   if (!req.body.currentPassword && !req.body.newPassword) {
//     return res.status(200).json({
//       status: "success",
//       data: {
//         user,
//       },
//     });
//   }
//   if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
//     return next(
//       new AppError("Please provide the correct current password", 401)
//     );
//   }

//   //update the password
//   user.password = req.body.newPassword;
//   user.passwordConfirm = req.body.newPassword;
//   await user.save();

//   //Log the user in and send the token
//   createSendToken(user, 201, res);
// });

exports.updateMe = catchAsync(async (req, res, next) => {
  let user;

  if (!req.body.currentPassword && !req.body.newPassword) {
    //I do not want to change passwords
    if (req.file) {
      req.body.photo = req.file.filename;
    }

    user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }

  //I need to take into the account the provided passwords

  user = await User.findById(req.user._id).select("+password");
  const fields = Object.keys(req.body);
  if (req.file) {
    fields.push("photo");
  }

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(
      new AppError("Please provide the correct current password", 401)
    );
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPassword;
  for (const key of fields) {
    user[key] = req.body[key];
  }

  await user.save();
  createSendToken(user, 201, res);
});

// exports.logout = (req, res, next) => {
//   res.cookie("jwt", "dummycookie", {
//     expiresIn: new Date(Date.now() + 1 * 1000),
//     httpOnly: true,
//   });
//   res.status(204).json({
//     status: "success",
//   });
// };
