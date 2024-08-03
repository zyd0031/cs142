"use strict";

const mongoose = require("mongoose");
const cs142password = require("../cs142password");

/**
 * Define the Mongoose Schema for a Comment.
 */
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  location: String,
  description: String,
  occupation: String,
  login_name: {type:String, required: true, unique: true},
  password_digest: { type: String, required: true },
  salt: { type: String, required: true }
});


/**
 * Create a Mongoose Model for a User using the userSchema.
 */
const User = mongoose.model("User", userSchema);

/**
 * Make this available to our application.
 */
module.exports = User;
