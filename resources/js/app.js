import axios from "axios";
import Noty from "noty";
import { initAdmin } from "./admin";
import moment from "moment";
import { initStripe } from "./stripe";

let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.getElementsByClassName("cartCounter");

function updateCart(pizza) {
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      for (let i = 0; i < cartCounter.length; i++) {
        cartCounter[i].innerText = res.data.totalQty;
      }

      new Noty({
        type: "success",
        timeout: 1000,
        text: "Item added to cart",
        progressBar: false,
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: "error",
        timeout: 1000,
        text: "Something went wrong",
        progressBar: false,
      }).show();
    });
}

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
  });
});

// Remove alert message after X seconds
const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

// Change order status

let statuses = document.querySelectorAll(".status_line");
let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement("small");

function updateStatus(order) {
  statuses.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current");
  });
  let stepCompleted = true;
  statuses.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add("step-completed");
    }
    if (dataProp === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current");
      }
    }
  });
}

updateStatus(order);

initStripe();

// Socket
let socket = io();

// Join
if (order) {
  socket.emit("join", `order_${order._id}`);
}
let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes("admin")) {
  initAdmin(socket);
  socket.emit("join", "adminRoom");
}

socket.on("orderUpdated", (data) => {
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
  new Noty({
    type: "success",
    timeout: 1000,
    text: "Order updated",
    progressBar: false,
  }).show();
  console.log(updatedOrder);
});

// show states
/*
const getStates = async () => {
  const path = "/data/states.json";
  const response = await fetch(path);
  const states = await response.json();

  states.map((state) => {
    const options = `<option value="${state.name}">${state.name} </option>`;

    const states = document.querySelectorAll(".state");
    states.forEach((state) => {
      state.innerHTML += options;
    });
  });
};

getStates();
*/

// show and hide address
const cancelBtn = document.querySelector(".cta_cancel");
const editProfileInfo = document.getElementById("edit-profile-info");
const inputBlocked = document.querySelectorAll(".input-blocked");
const profileInfoSubmitBtn = document.querySelector(".submit_profile_info");
const hideProfileBlock = document.querySelector("#hide-profile-block");
const genderSpanBlock = document.querySelectorAll(".gender-block span");
const editAddress = document.getElementsByClassName("edit-address");

if (cancelBtn) {
  cancelBtn.style.display = "none";
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", (e) => {
    cancelBtn.style.display = "none";
    addAddress.style.display = "flex";
  });
}

if (editProfileInfo) {
  editProfileInfo.addEventListener("click", (e) => {
    profileInfoSubmitBtn.style.display = "block";
    editProfileInfo.style.display = "none";
    profileInfoSubmitBtn.style.display = "block";
    hideProfileBlock.style.display = "block";

    // All input field remove disabled attribute
    inputBlocked.forEach((e) => {
      e.classList.remove("disabled");
      e.removeAttribute("disabled");
    });

    // Gender span block remove disabled class
    genderSpanBlock.forEach((e) => {
      e.style.cursor = "pointer";
    });
  });
}

if (hideProfileBlock) {
  hideProfileBlock.addEventListener("click", (e) => {
    profileInfoSubmitBtn.style.display = "none";
    editProfileInfo.style.display = "initial";
    hideProfileBlock.style.display = "none";

    // All input field show disabled attribute
    inputBlocked.forEach((e) => {
      e.classList.add("disabled");
      e.setAttribute("disabled", "true");
    });

    // Gender span block remove disabled class
    genderSpanBlock.forEach((e) => {
      e.style.cursor = "not-allowed";
    });
  });
}

const minusBtn = document.getElementsByClassName("quantity__minus");
const plusBtn = document.getElementsByClassName("quantity__plus");
// const quantityInput = document.getElementsByClassName("quantity__input");
// const emptyicon = document.getElementsByClassName("empty-cart-icon");
// const minusicon = document.getElementsByClassName("minus-icon");
// const itemPrice = document.getElementsByClassName("item-price").innerText;

// plus button
// for (let i = 0; i < plusBtn.length; i++) {
//   plusBtn[i].addEventListener("click", (e) => {
//     var buttonClicked = e.target;
//     var input = buttonClicked.parentElement.children[1];
//     var qtyValue = input.value;
//     var newValue = parseInt(qtyValue) + 1;
//     input.value = newValue;
//     window.location.href = "/cart/inc";
//   });
// }

// Minus btn
// for (let i = 0; i < minusBtn.length; i++) {
//   minusBtn[i].addEventListener("click", (e) => {
//     var buttonClicked = e.target;
//     var input = buttonClicked.parentElement.children[1];
//     var qtyValue = input.value;
//     var newValue = parseInt(qtyValue) - 1;
//     if (newValue >= 1) {
//       input.value = newValue;
//       window.location.href = "/cart/dec";
//     }
//   });
// }

// remove item in cart
const removeItem = document.getElementsByClassName("delete-cart-item");

for (let i = 0; i < removeItem.length; i++) {
  removeItem[i].addEventListener("click", () => {});
}

// navbar dropdown
const dropdown = document.getElementById("options-menu");

// navbar dropdown open with click

if (dropdown) {
  dropdown.addEventListener("click", () => {
    document.querySelector(".dropdown-menu").classList.toggle("show");
  });

  window.onclick = function (event) {
    if (!event.target.matches("#options-menu")) {
      var dropdowns = document.getElementsByClassName("dropdown-menu");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
  };
}

// dropdown edit and update addressBlock
const dropdownEdit = document.getElementsByClassName("dropdown-edit");

for (let i = 0; i < editAddress.length; i++) {
  editAddress[i].addEventListener("mouseover", () => {
    dropdownEdit[i].style.display = "block";
  });
}
for (let j = 0; j < dropdownEdit.length; j++) {
  dropdownEdit[j].addEventListener("mouseleave", () => {
    dropdownEdit[j].style.display = "none";
  });
}

// navbar icon open/close toggle

const toggleIcon = document.getElementById("toggle-open");
const navMenu = document.querySelector(".nav-menu");
const closeIcon = document.getElementById("close-icon");

toggleIcon.addEventListener("click", () => {
  navMenu.style.display = "block";
  toggleIcon.style.display = "none";
  closeIcon.style.display = "block";
});

closeIcon.addEventListener("click", () => {
  navMenu.style.display = "none";
  closeIcon.style.display = "none";
  toggleIcon.style.display = "block";
});
