const Order = require("../../models/order");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_PVT_KEY);
// const shortid = require("shortid");
// const Razorpay = require("razorpay");
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

function orderController() {
  return {
    store(req, res) {
      // validate request
      const {
        paymentType,
        phone,
        address,
        firstname,
        lastname,
        landmark,
        pincode,
        stripeToken,
      } = req.body;

      if (
        !phone ||
        !paymentType ||
        !firstname ||
        !address ||
        !lastname ||
        !pincode
      ) {
        return res.status(422).json({ message: "All fields are required" });
      }
      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        paymentType: paymentType,
        address: {
          firstName: firstname,
          lastName: lastname,
          street_address: address,
          landmark: landmark,
          pincode: pincode,
          phone: phone,
        },
      });
      order
        .save()
        .then((result) => {
          Order.populate(result, { path: "customerId" }, (err, placedOrder) => {
            // Stripe Payment
            if (paymentType === "stripe") {
              stripe.charges
                .create({
                  amount: req.session.cart.totalPrice * 100,
                  source: stripeToken,
                  currency: "inr",
                  description: `Pizza order Id: ${placedOrder._id}`,
                })
                .then(() => {
                  placedOrder.paymentStatus = true;
                  placedOrder.paymentType = paymentType;
                  placedOrder
                    .save()
                    .then((ord) => {
                      // Emit event
                      const eventEmitter = req.app.get("eventEmitter");
                      eventEmitter.emit("orderPlaced", ord);
                      delete req.session.cart;
                      return res.status(200).json({
                        message:
                          "Payment successful, Order placed successfully",
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  delete req.session.cart;
                  return res.status(422).json({
                    message:
                      "Order Placed but Payment Failed, You can pay at delivery time",
                  });
                });
            }

            // if (paymentType === "razorpay") {
            //   const payment_capture = 1;
            //   const currency = "INR";

            //   const options = {
            //     amount: 40000,
            //     currency,
            //     receipt: shortid.generate(),
            //     payment_capture,
            //   };

            //   try {
            //     const response = razorpay.orders.create(options);
            //     console.log(response);
            //     res
            //       .json({
            //         id: response.id,
            //         currency: response.currency,
            //         amount: response.amount,
            //       })
            //       .then(() => {
            //         placedOrder.paymentStatus = true;
            //         placedOrder.paymentType = paymentType;
            //         placedOrder
            //           .save()
            //           .then((ord) => {
            //             // Emit event
            //             const eventEmitter = req.app.get("eventEmitter");
            //             eventEmitter.emit("orderPlaced", ord);
            //             delete req.session.cart;
            //             return res.status(200).json({
            //               message:
            //                 "Payment successful, Order placed successfully",
            //             });
            //           })
            //           .catch((err) => {
            //             console.log(err);
            //           });
            //       });
            //   } catch (error) {
            //     delete req.session.cart;
            //     return res.status(422).json({
            //       message:
            //         "Order Placed but Payment Failed, You can pay at delivery time",
            //     });
            //   }
            // }

            if (
              paymentType === "paytm" ||
              paymentType === "gPay" ||
              paymentType === "amazonPay" ||
              paymentType === "razorpay"
            ) {
              return;
            } else {
              delete req.session.cart;
              return res
                .status(200)
                .json({ message: "Order placed succesfully" });
            }
          });
        })
        .catch((err) => {
          return res.status(500).json({ message: "Something went wrong" });
        });
    },
    async index(req, res) {
      try {
        const orders = await Order.find(
          {
            customerId: req.user._id,
          },
          null,
          { sort: { createdAt: -1 } }
        );
        res.header(
          "Cache-Control",
          "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
        );

        res.render("customers/orders", { orders, moment: moment });
      } catch (error) {
        console.log(error);
      }
    },
    async show(req, res) {
      try {
        const orders = await Order.findById(req.params.id);

        res.render("customers/singleOrder", { orders });
      } catch (error) {
        console.log(error);
      }
    },
  };
}

module.exports = orderController;
