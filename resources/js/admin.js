import axios from "axios";
import moment from "moment";
import Noty from "noty";

export function initAdmin(socket) {
  const orderTableBody = document.querySelector("#orderTableBody");
  let orders = [];
  let markup;
  axios
    .get("/admin/orders", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res) => {
      orders = res.data;
      markup = generateMarkup(orders);
      orderTableBody.innerHTML = markup;
    })
    .catch((err) => {
      console.log(err);
    });

  function renderItems(items) {
    let parsedItems = Object.values(items);
    return parsedItems
      .map((menuItem) => {
        return `
                <div class="flex justify-between items-center">
                <div>
                <p></p>
                  <p><b>${menuItem.item.name} - Pizza</b></p>
                   <p class="text-gray-700">${menuItem.item.size} - ${
          menuItem.qty
        }pcs</p>
                  </div>
                  <div>
                  <p class="text-gray-700">₹${
                    menuItem.item.price * menuItem.qty
                  }</p>
                  
                  </div>
                  </div>
            `;
      })
      .join("");
  }

  function generateMarkup(orders) {
    return orders
      .map((order) => {
        return `<tr>
                <td class="border  border-l-0  px-4 py-2 text-green-900">
                    <p class="text-primary uppercase mb-1">${order._id}</p>
                    <div class="mb-1">${renderItems(order.items)}</div>
                       <div class="flex justify-between mt-1"><p><b>Total Amount</b></p>
                  <p class="text-gray-700">₹700</p></div>
                </div>
                </td>
                <td class="border px-4 py-2">${order.address.firstName} ${
          order.address.lastName
        }</td>
                <td class="border px-4 py-2">${
                  order.address.street_address
                }</td>
                <td class="border px-4 py-2">
                    <div class="relative">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${
                              order._id
                            }">
                            <select name="status" onchange="this.form.submit()"
                                class="block w-full cursor-pointer focus:ring-0 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 focus:outline-none focus:border-gray-800 focus:shadow-outline">
                                <option value="order_placed"
                                    ${
                                      order.status === "order_placed"
                                        ? "selected"
                                        : ""
                                    }>
                                    Placed</option>
                                     <option value="cancelled" ${
                                       order.status === "cancelled"
                                         ? "selected"
                                         : ""
                                     }>
                                    Cancelled</option>
                                <option value="confirmed" ${
                                  order.status === "confirmed" ? "selected" : ""
                                }>
                                    Confirmed</option>
                                <option value="prepared" ${
                                  order.status === "prepared" ? "selected" : ""
                                }>
                                    Prepared</option>
                                <option value="delivered" ${
                                  order.status === "delivered" ? "selected" : ""
                                }>
                                    Delivered
                                </option>
                                <option value="completed" ${
                                  order.status === "completed" ? "selected" : ""
                                }>
                                    Completed
                                </option>
                            </select>
                        </form>     
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format("Do MMM YYYY, h:mm A")}
                </td>
                <td class="border border-r-0 px-4 py-2">
                    ${order.paymentStatus ? "paid" : "Not paid"}
                </td>
            </tr>`;
      })
      .join("");
  }
  // Socket
  socket.on("orderPlaced", (order) => {
    new Noty({
      text: "New order!",
      type: "success",
      timeout: 1000,
      progressBar: false,
    }).show();
    orders.unshift(order);
    orderTableBody.innerHTML = "";
    orderTableBody.innerHTML = generateMarkup(orders);
  });
}
