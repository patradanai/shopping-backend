const express = require("express");
const db = require("./src/models");
const cors = require("cors");
const isForceDb = false;
const AuthRoutes = require("./src/routes/Auth.routes");
const ShopRoutes = require("./src/routes/Shop.routes");
const ProductRoutes = require("./src/routes/Product.routes");
const CategoryRoutes = require("./src/routes/Category.routes");
const CartRoutes = require("./src/routes/Cart.routes");
const OrderRoutes = require("./src/routes/Order.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/auth", AuthRoutes);

app.use("/db_shop", ShopRoutes);

app.use("/db_product", ProductRoutes);

app.use("/db_category", CategoryRoutes);

app.use("/db_cart", CartRoutes);

app.use("/db_order", OrderRoutes);

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
    if (isForceDb) {
      db.Role.bulkCreate([
        { role: "Administrator" },
        { role: "Staff" },
        { role: "Customer" },
        { role: "Moderator" },
      ]);
      db.OrderStatus.bulkCreate([
        { name: "Pending" },
        { name: "Paid" },
        { name: "Delivery" },
        { name: "Processed" },
        { name: "Cancelled" },
      ]);
      db.Payment.bulkCreate([
        { name: "Cod" },
        { name: "Credit Card" },
        { name: "Paypal" },
      ]);
      db.Category.bulkCreate([
        { name: "All Departments" },
        { name: "Arts & Crafts" },
        { name: "Automotive" },
        { name: "Baby" },
        { name: "Beauty & Personal Care" },
        { name: "Book" },
        { name: "Computers" },
        { name: "Electronics" },
        { name: "Woman's Fashion" },
        { name: "Men's Fashion" },
        { name: "Gril's Fashion" },
        { name: "Boy's Fashion" },
        { name: "Health & HouseHold" },
        { name: "Home & Kitchen" },
        { name: "Industrial & Scienfics" },
        { name: "Luggage" },
        { name: "Pet Suppliers" },
        { name: "Software & Hardware" },
        { name: "Sport & Outdoor" },
        { name: "Tool & Home Improvement" },
        { name: "Toy & Games" },
      ]);
    }
  })
  .catch((err) => console.log(err));
