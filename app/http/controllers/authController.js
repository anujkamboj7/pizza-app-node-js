const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

function authController() {
  const _getRedirectUrl = (req) => {
    // return req.user.role === "admin" ? "/admin/orders" : "customer/orders";
    return req.user.role === "admin" ? "/" : "/";
  };
  return {
    login(req, res) {
      res.render("auth/login");
    },
    postLogin(req, res, next) {
      passport.authenticate("local", (err, user, info) => {
        // show error msg
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }

        req.login(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }

          return res.redirect(_getRedirectUrl(req));
        });
      })(req, res, next);
    },
    register(req, res) {
      res.render("auth/register");
    },
    async postRegister(req, res) {
      const { email, password } = req.body;
      console.log(req.body);

      // check if email exists
      User.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash("error", "The email address is already taken");
          return res.redirect("/register");
        }
      });

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const user = new User({
        email,
        password: hashedPassword,
      });

      user
        .save()
        .then(() => {
          return res.redirect("/login");
        })
        .catch((err) => {
          req.flash("error", "Something went wrong please try again");
          console.log(err);
        });
    },
    logout(req, res) {
      req.logout();
      return res.redirect("/");
    },
  };
}

module.exports = authController;
