const mockAuthenticateToken = (req, res, next) => {
  // For testing purposes, always assume the user is authenticated
  req.user = { userId: "mockUserId" };
  next();
};

module.exports = {
  mockAuthenticateToken,
};
