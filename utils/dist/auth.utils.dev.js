"use strict";

var jwt = require("jsonwebtoken");

var generateToken = function generateToken(user) {
  console.log("JWT Secret: ", process.env.JWT_SECRET);
  return jwt.sign({
    id: user._id,
    role: user.role
  }, process.env.JWT_SECRET, {
    expiresIn: "24h" // Token expires in 24 hours

  });
};

var sendResponseWithToken = function sendResponseWithToken(user, statusCode, res) {
  var token = generateToken(user);
  res.status(statusCode).json({
    id: user._id,
    token: token
  });
};

module.exports = {
  generateToken: generateToken,
  sendResponseWithToken: sendResponseWithToken
};
//# sourceMappingURL=auth.utils.dev.js.map
