jest.mock("./middleware/auth.middleware.js", () => {
  return (req, res, next) => {
    req.user = { id: "mockUserId" }; // Replace with a suitable ID
    next();
  };
});
