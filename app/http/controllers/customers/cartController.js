const { json } = require("express");
const User = require("../../models/user");
function cartController() {
  return {
    async index(req, res) {
      const users = await User.find({});
      return res.render("customers/cart", { users });
    },
    update(req, res) {
      // let cart = {
      //   items: {
      //     pizzaId: { item: pizzaObject, qty: 0 },
      //     pizzaId: { item: pizzaObject, qty: 0 },
      //     pizzaId: { item: pizzaObject, qty: 0 },
      //   },
      //   totalQty: 0,
      //   totalPrice: 0,
      // };
      // for the first time creating cart and adding basic object structure
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0,
        };
      }
      let cart = req.session.cart;

      // Check if item does not exist in cart
      if (!cart.items[req.body._id]) {
        cart.items[req.body._id] = {
          item: req.body,
          qty: 1,
        };
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      } else {
        cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      }
      return res.json({ totalQty: req.session.cart.totalQty });
    },
    deleteItem(req, res) {
      let cart = req.session.cart;
      if (!cart.items) {
        delete req.session.cart;
      }
      cart.totalQty = cart.totalQty - req.session.cart.items[req.body.id].qty;
      cart.totalPrice =
        cart.totalPrice -
        req.session.cart.items[req.body.id].item.price *
          req.session.cart.items[req.body.id].qty;
      delete req.session.cart.items[req.body.id];
      return res.redirect("/cart");
    },
    inc(req, res) {
      let cart = req.session.cart;
      // cart.totalQty = cart.totalQty + 1;
      // cart.items.price = cart.items.price + 1;
      return res.redirect("/cart");
    },
    dec(req, res) {
      let cart = req.session.cart;
      cart.totalQty = cart.totalQty - 1;

      return res.redirect("/cart");
    },
    async deleteAddress(req, res) {
      const id = req.params.id;
      const user = await User.findOneAndDelete({
        address: {
          _id: id,
        },
      });
      console.log(user);
      res.redirect("/cart");
    },
  };
}

module.exports = cartController;
