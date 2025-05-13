const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { STATUS_CODE } = require("../constants/statusCode");

const addProductToCart = (req, res) => {
  const { name, description, price } = req.body;
  const product = new Product(name, description, parseFloat(price));
  Product.add(product);

  try {
    Cart.add(name);
    res.status(STATUS_CODE.FOUND).redirect("/products/new");
  } catch (error) {
    res.status(STATUS_CODE.NOT_FOUND).render("404", {
      headTitle: "404 - Product Not Found",
      menuLinks: require("../constants/navigation").MENU_LINKS,
      activeLinkPath: "",
      cartCount: Cart.getProductsQuantity(),
    });
  }
};

const getProductsCount = (req, res) => {
  const quantity = Cart.getProductsQuantity();
  res.json({ quantity });
};

module.exports = { addProductToCart, getProductsCount };