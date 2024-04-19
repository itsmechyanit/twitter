const mongoose = require("mongoose");

const validator = require("validator");
const crypto = require("crypto");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email address"],
    unique: true,

    validate: [validator.isEmail, "Please provide a valid email address"],
  },

  username: {
    type: String,
    required: [true, "Please provide your username"],
    unique: true,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },

  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm the password"],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: "The passwords do not match",
    },
  },
  passwordChangedAt: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (this.isNew || !this.isModified("password")) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candiatePassword,
  password
) {
  return await bcrypt.compare(candiatePassword, password);
};
userSchema.methods.passwordChangedAfterToken = function (tokenIssuedTime) {
  if (this.passwordChangedAt) {
    const passwordChangedTime = this.passwordChangedAt.getTime() / 1000;
    return passwordChangedTime > tokenIssuedTime;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
