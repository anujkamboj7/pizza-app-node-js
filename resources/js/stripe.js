import { loadStripe } from "@stripe/stripe-js";
import { placeOrder } from "./apiService";
export async function initStripe() {
  const stripe = await loadStripe(
    "pk_test_51Hon0HHBbqoWJa8GIWctzN1alZZmf5ywkRLpizX9trUoaa4SWfUY9349RSvcSLQk1k6dLzOjUy6DrXNGeRkVRqKO000MkdcsAH"
  );

  let card = null;

  function mountWidget() {
    const elements = stripe.elements();

    let style = {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    };

    card = elements.create("card", { style, hidePostalCode: true });
    card.mount("#card-element");
  }

  const paymentType = document.querySelector("#stripe");
  const paymentTypePatym = document.querySelector("#paytm");
  const paymentTypeGpay = document.querySelector("#gPay");
  const paymentTypeAmazonPay = document.querySelector("#amazonPay");
  const paymentTypeCod = document.querySelector("#cod");
  const paymentTypeRazorpay = document.querySelector("#razorpay");

  if (!paymentType) {
    return;
  }

  paymentType.addEventListener("click", (e) => {
    if (e.target.value === "stripe") {
      // Display Widget
      mountWidget();
    } else {
      card.destroy();
    }
  });

  paymentTypeCod.addEventListener("click", (e) => {
    if (e.target.value === "cod") {
      if (card) {
        card.destroy();
      }
    }
  });
  paymentTypePatym.addEventListener("click", (e) => {
    if (e.target.value === "paytm") {
      if (card) {
        card.destroy();
      }
    }
  });
  paymentTypeGpay.addEventListener("click", (e) => {
    if (e.target.value === "gPay") {
      if (card) {
        card.destroy();
      }
    }
  });
  paymentTypeAmazonPay.addEventListener("click", (e) => {
    if (e.target.value === "amazonPay") {
      if (card) {
        card.destroy();
      }
    }
  });
  paymentTypeRazorpay.addEventListener("click", (e) => {
    if (e.target.value === "razorpay") {
      if (card) {
        card.destroy();
      }
    }
  });

  // Ajax call
  const paymentForm = document.querySelector("#payment-form");

  if (paymentForm) {
    paymentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let formData = new FormData(paymentForm);
      let formObject = {};
      for (let [key, value] of formData.entries()) {
        formObject[key] = value;
      }

      // if (paymentTypeRazorpay.checked == true) {
      //   displayRazorpay();
      //   placeOrder(formObject);
      // }

      if (!card) {
        // Ajax
        placeOrder(formObject);
        return;
      }
      if (paymentTypeCod) {
        placeOrder(formObject);
        return;
      }
      // Verify card
      stripe
        .createToken(card)
        .then((result) => {
          // console.log(result);
          formObject.stripeToken = result.token.id;
          placeOrder(formObject);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}
