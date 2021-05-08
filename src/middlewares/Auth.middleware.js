const jwt = require("jsonwebtoken");

exports.isAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json({ Error: "Token Invalid" });
  }

  // Split Token
  const tokenSplit = authorization.split(" ");

  // Verify Token
  jwt.verify(tokenSplit[1], process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unathorized!!!!" });
    }

    req.userId = user.userId;
    next();
  });
};
