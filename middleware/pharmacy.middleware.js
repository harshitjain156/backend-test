const pharmacyMiddleware = (req, res, next) => {
  const user = req.user;
  if (user.role == "Pharmacy") {
    next();
  } else {
    res.status(401).message("Unothurized");
  }
};

module.exports = {
  pharmacyMiddleware,
};
