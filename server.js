const express = require("express");
const db = require("./src/models");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes

// Run Server
db.sequelize
  .sync({ force: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server RUNNING ON PORT : ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
