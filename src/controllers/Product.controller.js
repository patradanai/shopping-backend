const Sequelize = require("sequelize");
const db = require("../models");
const User = db.User;
const Product = db.Product;
const Category = db.Category;

// create, update, delete by admin or staff shop

exports.createProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { name, price, isActive, imageSrc, categoryId } = req.body;

  try {
    // Check User
    const userInstance = await User.findByPk(userId);
    const shopId = await userInstance.getShop();
    if (shopId.id != id) {
      return res
        .status(401)
        .json({ Error: `Unthorization with Shop ID :${id}` });
    }

    // Category Instanace
    const categoryInstance = await Category.findByPk(categoryId);

    const productInstance = await shopId.createProduct({
      name: name,
      price: price,
      isActive: isActive,
      imageSrc: imageSrc,
      UserId: userInstance.id,
      CategoryId: categoryInstance.id,
    });
    if (!productInstance) {
      return res.status(403).json({ Error: "Create product failure" });
    }

    // // Create Product
    // const productInstance = await Product.create({
    //   name: name,
    //   price: price,
    //   isActive: isActive,
    //   imageSrc: imageSrc,
    // });
    // // Update userId and shopId
    // await productInstance.setUser(userInstance);
    // await productInstance.setShop([shopId.id]);

    return res.status(200).json({ message: "Create Product Completed" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { name, price, isActive, imageSrc, categoryId } = req.body;

  try {
    // getShopid from User
    const userInstance = await User.findByPk(userId);
    const shopId = await userInstance.getShop();

    // Category Instanace
    const categoryInstance = await Category.findByPk(categoryId);

    // Get instance Product
    const ProductInstance = await shopId.getProducts({ where: { id: id } });
    if (!ProductInstance.length > 0) {
      return res.status(404).json({ Error: `Product Id : ${id} not found ` });
    }

    ProductInstance[0].name = name;
    ProductInstance[0].price = price;
    ProductInstance[0].isActive = isActive;
    ProductInstance[0].imageSrc = imageSrc;
    ProductInstance[0].CategoryId = categoryInstance.id;

    await ProductInstance[0].save();

    return res.status(200).json({ message: "Completed Update Product " });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  try {
    // Get Instance User
    const userInstance = await User.findByPk(userId);
    const shopId = await userInstance.getShop();

    // Get Instance Product
    const productInstance = await shopId.getProducts({ where: { id: id } });
    if (!productInstance.length > 0) {
      return res.status(404).json({ Error: `Product Id : ${id} not found ` });
    }

    await productInstance[0].destroy();
    return res.status(200).json({ message: "Completed Delete Product" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

// Read by customer

exports.products = async (req, res) => {
  try {
    // Easy Logic Rnd Show
    const productInstace = await Product.findAll({
      attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
      order: Sequelize.literal("RAND()"),
      limit: 20,
    });

    return res.status(200).json({ data: productInstace });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.product = async (req, res) => {
  const { id } = req.params;

  try {
    const productInstace = await Product.findByPk(id, {
      attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
    });
    if (!productInstace) {
      return res.status(404).json({ Error: `Not Found Product Id : ${id}` });
    }

    return res.status(200).json({ data: productInstace });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

// Read by shop

exports.shopProducts = async (req, res) => {
  const { shopId } = req.params;

  try {
    // Easy Logic Rnd Show
    const productInstace = await Product.findAll({ where: { ShopId: shopId } });

    return res.status(200).json({ data: productInstace });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.shopProduct = async (req, res) => {
  const { shopId, id } = req.params;

  try {
    const productInstace = await Product.findOne(
      { where: { id: id, ShopId: shopId } },
      {
        attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
      }
    );
    if (!productInstace) {
      return res.status(404).json({ Error: `Not Found Product Id : ${id}` });
    }
    return res.status(200).json({ data: productInstace });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
