const express = require("express");
const db = require("./src/models");
const cors = require("cors");
const isForceDb = false;
const AuthRoutes = require("./src/routes/Auth.routes");
const ShopRoutes = require("./src/routes/Shop.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/auth", AuthRoutes);

app.use("/db_shop", ShopRoutes);

// Run Server
db.sequelize
  .sync({ force: isForceDb })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server RUNNING ON PORT : ${PORT}`);
    });
  })
  .then(() => {
    // Init Database
    // db.Role.bulkCreate([
    //   { role: "Administrator" },
    //   { role: "Staff" },
    //   { role: "Customer" },
    //   { role: "Moderator" },
    // ]);
    // db.OrderStatus.bulkCreate([
    //   { name: "Pending" },
    //   { name: "Paid" },
    //   { name: "Delivery" },
    //   { name: "Processed" },
    //   { name: "Cancelled" },
    // ]);
    // db.Payment.bulkCreate([
    //   { name: "Cod" },
    //   { name: "Credit Card" },
    //   { name: "Paypal" },
    // ]);
  })
  .catch((err) => console.log(err));
