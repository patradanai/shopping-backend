const db = require("../models");
const Log = db.Log;
const User = db.User;
const Shop = db.Shop;

exports.getLogs = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // Log with eager Loading and filter by shopId
    const logInstance = await Log.findAll({
      include: {
        model: User,
        required: true,
        attributes: ["id"],
        include: { model: Shop, required: true, where: { id: id } },
      },
    });

    return res.status(200).json({ logs: logInstance });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
