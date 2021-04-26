const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = db.User;
const Role = db.Role;

exports.signIn = async (req, res) => {
  const { username, password } = req.body;

  // Validate User and Password
  if (!username || !password) {
    return res.status(400).json({ message: "Invalid User or Password" });
  }

  try {
    // Check User in db
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      return res.status(404).json({ Error: "User not exsting" });
    }

    // Compare Password
    const comparePassword = await bcrypt.compareSync(
      password.toString(),
      user.password
    );
    if (!comparePassword) {
      return res.status(401).json({ Error: "User or Password invalid" });
    }

    // Token
    const token = jwt.sign(
      { userId: user.id, name: user.fname + user.lname },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token: token });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.signUp = async (req, res) => {
  const { email, fname, lname, password } = req.body;

  try {
    // Check Existing in Database
    const user = await User.findOne({ where: { username: email } });
    if (user) {
      return res.status(422).json({ Error: "User existing" });
    }

    // Hashing and Create in DB
    const hashedPw = await bcrypt.hashSync(password.toString(), 10);

    // Create in Db
    const userSaved = await User.create({
      username: email,
      password: hashedPw,
      email: email,
      fname: fname,
      lname: lname,
    });

    // Set Default Role
    const role = await Role.findOne({ where: { role: "Administrator" } });

    // Save Role
    await userSaved.setRoles(role);

    return res.status(200).json({ message: "Register Complete" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
