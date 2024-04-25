const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  console.log("JWT Secret: ", process.env.JWT_SECRET);

  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "24h", // Token expires in 24 hours
  });
};

const sendResponseWithToken = (user, statusCode, res) => {
  const token = generateToken(user);
  res.status(statusCode).json({ id: user._id, token });
};

module.exports = {
  generateToken,
  sendResponseWithToken,
};
