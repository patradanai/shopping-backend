const db = require("../models");
const User = db.User;

exports.isRole = (...roles) => {
  return async (req, res, next) => {
    const userId = req.userId;

    try {
      const user_role = await User.findByPk(userId);
      if (!user_role) {
        return res.status(400).json({ Error: "Not Found UserId" });
      }

      // Get Role then extract in array
      const roleRes = await user_role.getRoles();
      const stackrole = roleRes.map((role) => role.role);

      if (roles.includes(...stackrole)) next();
      else return res.status(401).json({ Error: "Unthorization" });
    } catch (err) {
      return res.status(500).json({ Error: err.message });
    }
  };
};
