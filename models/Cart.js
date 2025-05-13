const Product = require("../models/Product");

class Cart {
  static #items = [];

  static add(productName) {
    const product = Product.findByName(productName);
    if (!product) {
      throw new Error(`Product with name "${productName}" not found`);
    }

    const existingItem = this.#items.find(item => item.product.name === productName);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.#items.push({ product, quantity: 1 });
    }

    return this.#items.length;
  }

  static getItems() {
    return this.#items;
  }

  static getTotalPrice() {
    return this.#items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  static getProductsQuantity() {
    return this.#items.reduce((total, item) => total + item.quantity, 0);
  }

  static clearCart() {
    this.#items = [];
  }
}

module.exports = Cart;