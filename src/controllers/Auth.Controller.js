const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = db.User;
const Role = db.Role;
const Shop = db.Shop;
const Address = db.Address;

/**
 * Shop Signin & Customer & Staff Signin
 * @param {*} req
 * @param {*} res
 * @returns
 */
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

/**
 * Shop Regsiter
 * @param {*} req
 * @param {*} res
 * @returns
 */

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
      isActive: true,
    });
    // Create Shop
    await userSaved.createShop({
      name: fname + "'s Shop",
      isActive: true,
      ownerId: userSaved.id,
    });

    // Create Address
    await userSaved.createAddress();

    // Create Cart
    await userSaved.createCart();

    // Set Default Role
    const role = await Role.findOne({ where: { role: "Administrator" } });

    // Save Role
    await userSaved.setRoles(role);

    return res.status(200).json({ message: "Register Complete" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

/**
 * Customer Regsiter
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.signUpCustomer = async (req, res) => {
  const { email, fname, lname, password } = req.body;
  const userId = req.userId; // Owner Id

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
      isActive: true,
    });

    // Create Address
    await userSaved.createAddress();

    // Create Cart
    await userSaved.createCart();

    // Set Default Role
    const role = await Role.findOne({ where: { role: "Customer" } });

    // Save Role
    await userSaved.setRoles(role);

    return res.status(200).json({ message: "Register Complete" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

/**
 * Moderator Regsiter
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.signUpModerator = async (req, res) => {
  const { email, fname, lname, password } = req.body;
  const userId = req.userId; // Owner Id

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
      isActive: true,
    });
    const userInstanace = await User.findByPk(userId);

    // Set Shop Owner
    const ShopInstace = await userInstanace.getShop();

    await userSaved.setShop(ShopInstace);

    // Create Address
    await userSaved.createAddress();

    // Create Cart
    await userSaved.createCart();

    // Set Default Role
    const role = await Role.findOne({ where: { role: "Staff" } });

    // Save Role
    await userSaved.setRoles(role);

    return res.status(200).json({ message: "Register Complete" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

/**
 * Profile User Regsiter
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.profileUser = async (req, res) => {
  const userId = req.userId;

  try {
    const userInstance = await User.findByPk(userId, {
      attributes: ["email", "fname", "lname", "phone"],
      include: [
        { model: Shop, attributes: ["id", "name", "isActive"] },
        {
          model: Role,
          attributes: ["role"],
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json(userInstance);
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

/**
 * update Profile User Regsiter
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.updateProfile = async (req, res) => {
  const userId = req.userId;
  const { address, postcode, country } = req.body;

  try {
    // userInstance for get Addr Id
    const userInstance = await User.findByPk(userId);
    if (!userInstance) {
      return res.status(404).json({ Error: `Not Found UserId` });
    }

    // addrInstance from PK
    const AddrInstanace = await Address.findByPk(userInstance.AddressId);
    if (!AddrInstanace) {
      return res.status(404).json({ Error: `Not Found Addr Id` });
    }
    AddrInstanace.address = address;
    AddrInstanace.postcode = postcode;
    AddrInstanace.country = country;

    await AddrInstanace.save();
    return res
      .status(200)
      .json({ message: `Completed Update Address Id :${id}` });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

/**
 * Get member Regsiter
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.memberShop = async (req, res) => {
  const userId = req.userId;

  try {
    // get UserInstance
    const userInstance = await User.findByPk(userId);

    const shopInstance = await Shop.findByPk(userInstance.ShopId);

    const allMemberShop = await shopInstance.getUsers({
      include: {
        model: Role,
        attributes: ["role"],
        through: { attributes: [] },
      },
      attributes: {
        exclude: ["username", "password", "createdAt", "updatedAt"],
      },
    });

    return res.status(200).json(allMemberShop);
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
