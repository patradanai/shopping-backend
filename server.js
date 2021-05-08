const express = require("express");
const path = require("path");
const db = require("./src/models");
const cors = require("cors");
const isForceDb = false;

const AuthRoutes = require("./src/routes/Auth.routes");
const ShopRoutes = require("./src/routes/Shop.routes");
const ProductRoutes = require("./src/routes/Product.routes");
const CategoryRoutes = require("./src/routes/Category.routes");
const CartRoutes = require("./src/routes/Cart.routes");
const OrderRoutes = require("./src/routes/Order.routes");
const ImageRoutes = require("./src/routes/Image.routes");
const LogRoutes = require("./src/routes/Log.routes");
const StockRoutes = require("./src/routes/Stock.routes");
const WishRoutes = require("./src/routes/Wish.routes");
const ShippingRoutes = require("./src/routes/Shipping.routes");
const PaymentRoutes = require("./src/routes/Payment.routes");

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

app.use("/db_image", ImageRoutes);

app.use("/db_log", LogRoutes);

app.use("/db_stock", StockRoutes);

app.use("/db_wish", WishRoutes);

app.use("/db_shipping", ShippingRoutes);

app.use("/db_payment", PaymentRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));

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
        { name: "Completed" },
        { name: "Cancelled" },
      ]);
      db.Payment.bulkCreate([
        { name: "Cod" },
        { name: "Credit Card" },
        { name: "Paypal" },
        { name: "Direct Bank" },
      ]);
      db.Category.bulkCreate([
        { name: "All Departments", imageSrc: "all_dep.png" },
        { name: "Arts & Crafts", imageSrc: "art&craft.png" },
        { name: "Automotive", imageSrc: "automotive.png" },
        { name: "Baby", imageSrc: "baby.png" },
        { name: "Beauty & Personal Care", imageSrc: "beauty.png" },
        { name: "Book", imageSrc: "book.png" },
        { name: "Computers", imageSrc: "computer.png" },
        { name: "Electronics", imageSrc: "electronic.png" },
        { name: "Woman's Fashion", imageSrc: "woman_fashion.png" },
        { name: "Men's Fashion", imageSrc: "men_fashion.png" },
        { name: "Girl's Fashion", imageSrc: "girl_fashion.png" },
        { name: "Boy's Fashion", imageSrc: "boy_fashion.png" },
        { name: "Health & HouseHold", imageSrc: "health.png" },
        { name: "Home & Kitchen", imageSrc: "home_kitchen.png" },
        { name: "Industrial & Scienfics", imageSrc: "scienfic.png" },
        { name: "Luggage", imageSrc: "luggage.png" },
        { name: "Pet Suppliers", imageSrc: "pet.png" },
        { name: "Software & Hardware", imageSrc: "software.png" },
        { name: "Sport & Outdoor", imageSrc: "sport.png" },
        { name: "Tool & Home Improvement", imageSrc: "tool.png" },
        { name: "Toy & Games", imageSrc: "toy.png" },
        { name: "Others", imageSrc: "other.png" },
      ]);
      db.StockTransactionType.bulkCreate([
        { name: "StockIn" },
        { name: "StockOut" },
      ]);
      db.ShippingMethod.bulkCreate([
        { name: "Standard", price: 30 },
        { name: "Ems", price: 50 },
        { name: "Kerry", price: 50 },
        { name: "Flash", price: 35 },
        { name: "J&T", price: 35 },
      ]);
    }
  })
  .catch((err) => console.log(err));
