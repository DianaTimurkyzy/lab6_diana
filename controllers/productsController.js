const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { STATUS_CODE } = require("../constants/statusCode");
const { MENU_LINKS } = require("../constants/navigation");

const getProductsView = (req, res) => {
  const products = Product.getAll();
  const cartCount = Cart.getProductsQuantity();
  res.render("products", {
    headTitle: "Shop - Products",
    path: "/",
    menuLinks: MENU_LINKS,
    activeLinkPath: "/products",
    products,
    cartCount,
  });
};

const getAddProductView = (req, res) => {
  const cartCount = Cart.getProductsQuantity();
  res.render("add-product", {
    headTitle: "Shop - Add product",
    path: "/add",
    menuLinks: MENU_LINKS,
    activeLinkPath: "/products/add",
    cartCount,
  });
};

const getNewProductView = (req, res) => {
  const newestProduct = Product.getLast();
  const cartCount = Cart.getProductsQuantity();
  res.render("new-product", {
    headTitle: "Shop - New product",
    path: "/new",
    menuLinks: MENU_LINKS,
    activeLinkPath: "/products/new",
    newestProduct,
    cartCount,
  });
};

const getProductView = (req, res) => {
  const { name } = req.params;
  const product = Product.findByName(name);
  const cartCount = Cart.getProductsQuantity();
  res.render("product", {
    headTitle: `Shop - ${product ? product.name : "Product Not Found"}`,
    path: `/${name}`,
    menuLinks: MENU_LINKS,
    activeLinkPath: `/products/${name}`,
    product,
    cartCount,
  });
};

const deleteProduct = (req, res) => {
  const { name } = req.params;
  Product.deleteByName(name);
  const cartItems = Cart.getItems();
  const updatedItems = cartItems.filter(item => item.product.name !== name);
  Cart.clearCart();
  updatedItems.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      Cart.add(item.product.name);
    }
  });
  res.status(STATUS_CODE.OK).json({ success: true });
};

module.exports = {
  getProductsView,
  getAddProductView,
  getNewProductView,
  getProductView,
  deleteProduct,
};