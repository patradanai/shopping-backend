import express, { json, urlencoded } from "express";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// Routes

app.listen(PORT, () => {
  console.log(`Server RUNNING ON PORT : ${PORT}`);
});
