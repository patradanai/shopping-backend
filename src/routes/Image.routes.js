const express = require("express");
const path = require("path");
const { isAuth } = require("../middlewares/Auth.middleware");
const Router = express();
const multer = require("multer");
const _ = require("lodash");
const { v4 } = require("uuid");

const limits = {
  files: 1, // allow only 1 file per request
  fileSize: 1024 * 1024, // 1 MB (max file size)
};

const fileFilter = (req, file, cb) => {
  // supported image file mimetypes
  var allowedMimes = ["image/jpeg", "image/pjpeg", "image/png", "image/gif"];

  if (_.includes(allowedMimes, file.mimetype)) {
    // allow supported image files
    cb(null, true);
  } else {
    // throw error for invalid files
    cb(
      new Error(
        "Invalid file type. Only jpg, png and gif image files are allowed."
      )
    );
  }
};

var storageProfile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/profiles");
  },
  filename: function (req, file, cb) {
    cb(null, v4() + path.extname(file.originalname));
  },
});

var storageProduct = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/products");
  },
  filename: function (req, file, cb) {
    cb(null, v4() + path.extname(file.originalname));
  },
});

const configProfile = multer({
  storage: storageProfile,
  fileFilter: fileFilter,
});

const configProduct = multer({
  storage: storageProduct,
  fileFilter: fileFilter,
});

const Profile = configProfile.single("profile");

const Product = configProduct.single("product");

const uploadProfile = (req, res, next) => {
  Profile(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.send("Too many files to upload.");
      }
    } else if (err) {
      return res.send(err);
    }

    // Everything is ok.
    next();
  });
};

const uploadProduct = (req, res, next) => {
  Product(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.send("Too many files to upload.");
      }
    } else if (err) {
      return res.send(err);
    }

    // Everything is ok.
    next();
  });
};

// POST /footage/profile
Router.post("/footage/profile", [isAuth, uploadProfile], (req, res) => {
  const file = req.file.filename;
  const port = 4000;
  const base = req.protocol + "://" + req.hostname + (port ? ":" + port : "");

  const profileUrl = base + "/images/profiles/" + file;

  return res.status(200).json({ image: profileUrl });
});

// POST /footage/product
Router.post("/footage/product", [uploadProduct], (req, res) => {
  const file = req.file.filename;
  const port = 4000;
  const base = req.protocol + "://" + req.hostname + (port ? ":" + port : "");

  const productUrl = base + "/images/products/" + file;

  return res.status(200).json({ image: productUrl });
});

module.exports = Router;
