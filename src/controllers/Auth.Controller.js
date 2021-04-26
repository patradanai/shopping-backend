const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = db.User;
const Role = db.Role;
const expired = 60 * 60;

exports.signIn = async (res, req) => {
  const { username, password } = req.body;

  // Validate User and Password
  if (!username || !password) {
    return res.status(400).json({ message: "Invalid User or Password" });
  }

  // Check User in db
  const user = await User.findOne({ where: { username: username } });
  if (!user) {
    return res.status(404).json({ message: "User not exsting" });
  }

  // Compare Password
  const comparePassword = await bcrypt.compareSync(password, user.password);
  if (!comparePassword) {
    return res.status(401).json({ message: "User or Password invalid" });
  }

  // Token
  const token = jwt.sign(
    { userId: user.id, name: user.fname + user.lname },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  return res.status(200).json({ token: token });
};

exports.signUp = (res, req) => {
  const {} = req.body;
};
