const db = require("../models");
const Payment = db.Payment;

exports.getPayment = async (req, res) => {
  try {
    const paymentInstance = await Payment.findAll();

    return res.status(200).json(paymentInstance);
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
