const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const adminOrderController = require("../app/http/controllers/admin/adminOrderController");
const statusController = require("../app/http/controllers/admin/statusController");
const profileController = require("../app/http/controllers/customers/profileContoller");
const passport = require("passport");

// middleware
const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");
const admin = require("../app/http/middlewares/admin");

function initRoutes(app) {
  app.get("/", homeController().index);

  app.get("/login", guest, authController().login);

  app.get("/logout", authController().logout);

  app.post("/login", authController().postLogin);

  app.get("/register", guest, authController().register);

  app.post("/register", authController().postRegister);

  // cart
  app.get("/cart", cartController().index);

  app.post("/cart/remove-item", cartController().deleteItem);

  // app.get("/cart/inc", cartController().inc);
  // app.get("/cart/dec", cartController().dec);

  app.get("/cart/deleteaddress/:id", auth, cartController().deleteAddress);

  app.post("/update-cart", cartController().update);

  // cart ends

  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", {
      authType: "reauthenticate",
      scope: ["email"],
    })
  );

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      failureRedirect: "/login",
      successRedirect: "/",
    })
  );

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: "https://www.googleapis.com/auth/plus.login",
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      successRedirect: "/",
    })
  );

  // customer routes
  app.post("/orders", auth, orderController().store);
  app.get("/customer/orders", auth, orderController().index);
  app.get("/customer/orders/:id", auth, orderController().show);
  app.get("/customer/profile/", auth, profileController().index);
  app.post("/customer/profile/", auth, profileController().updateProfileInfo);

  app.post(
    "/customer/profile/updateaddressinfo",
    auth,
    profileController().updateAddressInfo
  );
  app.post(
    "/customer/profile/editaddressinfo/",
    auth,
    profileController().editAddressInfo
  );

  // Admin orders
  app.get("/admin/orders", admin, adminOrderController().index);
  app.post("/admin/order/status", admin, statusController().update);
}

module.exports = initRoutes;
