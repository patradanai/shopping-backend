const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { digioConfig } = require("../config/email");
const transporter = nodemailer.createTransport(digioConfig);
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
  const { username, password, expiredIn } = req.body;

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

    let token;
    // Token
    if (expiredIn) {
      token = jwt.sign(
        { userId: user.id, name: user.fname + user.lname },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
    } else {
      token = jwt.sign(
        { userId: user.id, name: user.fname + user.lname },
        process.env.SECRET_KEY
      );
    }

    //Get role
    const roles = await user.getRoles();
    let arrRole = [];
    roles.forEach((data, index) => {
      arrRole.push(`ROLE_${data.role?.toUpperCase()}`);
    });

    return res.status(200).json({ token: token, role: arrRole });
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

    await userSaved.createWishList();

    // Create Cart
    await userSaved.createCart();

    // Set Default Role
    const role = await Role.findOne({ where: { role: "Administrator" } });

    // Save Role
    await userSaved.setRoles(role);

    await transporter.sendMail({
      from: "E-shopping@digipay.dev", // sender address
      to: userSaved.email, // list of receivers
      subject: `Thank your for Register with E-Shopping`, // Subject line
      html: `<p><span style="background-color: rgb(0, 168, 133);"><span style="font-family: 'Lucida Console', Monaco, monospace;"><span style="font-size: 26px; color: rgb(251, 160, 38); background-color: rgb(204, 204, 204);"><strong><em>Thank you for Register our E-Shopping</em></strong></span></span></span></p>
      <p><br></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">Hi ${userSaved.fname}</span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;"><br></span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">You will be Administrator for your shop.</span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;"><br></span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">Username : ${userSaved.username}</span></p>
      <p><br></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">Thank you&nbsp;</span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">Best regards</span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">E-Shipping</span></p>`, // html body
    });

    return res.status(200).json({ message: "Register Complete" });
  } catch (err) {
    console.log(err);
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

    await userSaved.createWishList();

    // Create Cart
    await userSaved.createCart();

    // Set Default Role
    const role = await Role.findOne({ where: { role: "Customer" } });

    // Save Role
    await userSaved.setRoles(role);

    await transporter.sendMail({
      from: "E-shopping@digipay.dev", // sender address
      to: userSaved.email, // list of receivers
      subject: `Thank your for Register with E-Shopping`, // Subject line
      html: `<p><span style="background-color: rgb(0, 168, 133);"><span style="font-family: 'Lucida Console', Monaco, monospace;"><span style="font-size: 26px; color: rgb(251, 160, 38); background-color: rgb(204, 204, 204);"><strong><em>Thank you for Register our E-Shopping</em></strong></span></span></span></p>
      <p><br></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">Hi ${userSaved.fname}</span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;"><br></span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">You will be Customer for E-Shopping.</span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;"><br></span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">Username : ${userSaved.username}</span></p>
      <p><br></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">Thank you&nbsp;</span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">Best regards</span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">E-Shipping</span></p>`, // html body
    });

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
  const { email, fname, lname, password, phone } = req.body;
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
      phone: phone,
      isActive: true,
    });
    const userInstanace = await User.findByPk(userId);

    // Set Shop Owner
    const ShopInstace = await userInstanace.getShop();

    await userSaved.setShop(ShopInstace);

    // Create Address
    await userSaved.createAddress();

    await userSaved.createWishList();

    // Create Cart
    await userSaved.createCart();

    // Set Default Role
    const role = await Role.findOne({ where: { role: "Staff" } });

    // Save Role
    await userSaved.setRoles(role);

    // Add Logs
    await userSaved.createLog({
      type: "INSERT",
      eventType: "User",
      description: `Insert user Id : ${userSaved.id} in User's Table by ${userId}`,
    });

    await transporter.sendMail({
      from: "E-shopping@digipay.dev", // sender address
      to: userSaved.email, // list of receivers
      subject: `Thank your for Register with E-Shopping`, // Subject line
      html: `<p><span style="background-color: rgb(0, 168, 133);"><span style="font-family: 'Lucida Console', Monaco, monospace;"><span style="font-size: 26px; color: rgb(251, 160, 38); background-color: rgb(204, 204, 204);"><strong><em>Thank you for Register our E-Shopping</em></strong></span></span></span></p>
      <p><br></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">Hi ${userSaved.fname}</span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;"><br></span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">You will be staff for ${ShopInstace.name}.</span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;"><br></span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">Username : ${userSaved.username}</span></p>
      <p><br></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">Thank you&nbsp;</span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">Best regards</span></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">E-Shipping</span></p>`, // html body
    });

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
      attributes: ["email", "fname", "lname", "phone", "imageSrc"],
      include: [
        { model: Shop, attributes: ["id", "name", "isActive"] },
        {
          model: Role,
          attributes: ["role"],
          through: { attributes: [] },
        },
        {
          model: Address,
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
  const { fname, lname, phone, email, imageSrc } = req.body;

  try {
    // userInstance for get Addr Id
    const userInstance = await User.findByPk(userId);
    if (!userInstance) {
      return res.status(404).json({ Error: `Not Found UserId` });
    }

    userInstance.fname = fname;
    userInstance.lname = lname;
    userInstance.phone = phone;
    userInstance.email = email;
    userInstance.imageSrc = imageSrc;

    await userInstance.save();

    // Add Logs
    await userInstance.createLog({
      type: "UPDATE",
      eventType: "User",
      description: `Update user Id : ${userId} in User's Table`,
    });

    return res.status(200).json({ message: `Completed Update Id :${userId}` });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.updateAddress = async (req, res) => {
  const userId = req.userId;
  const { address, postcode, country } = req.body;

  try {
    // userInstance for get Addr Id
    const userInstance = await User.findByPk(userId);
    if (!userInstance) {
      return res.status(404).json({ Error: `Not Found UserId` });
    }

    // addrInstance from PK
    const AddrInstanace = await userInstance.getAddress();
    if (!AddrInstanace) {
      return res.status(404).json({ Error: `Not Found Addr Id` });
    }
    AddrInstanace.address = address;
    AddrInstanace.postcode = postcode;
    AddrInstanace.country = country;

    await AddrInstanace.save();

    // Add Logs
    await userInstance.createLog({
      type: "UPDATE",
      eventType: "User",
      description: `Update user Id : ${userId} in User's Table`,
    });

    return res
      .status(200)
      .json({ message: `Completed Update Address Id :${userId}` });
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

exports.isActiveUser = async (req, res) => {
  const userId = req.userId;
  const { isActive } = req.body;
  const { id } = req.params;

  try {
    // get userInstance
    const userInstance = await User.findByPk(userId);

    const shopInstane = await userInstance.getShop();

    const userShop = await shopInstane.getUsers({ where: { id: id } });

    userShop[0].isActive = isActive;

    await userShop[0].save();

    return res.status(200).json({ message: "Completed update status user" });
  } catch (err) {}
};
