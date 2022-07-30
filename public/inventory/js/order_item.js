$(document).ready(function () {
  getOrder_items();
});

var Order_itemTableOffset = 0;
var Order_itemTableLimit = 10;
var Order_itemTableOrderField = "id";
var Order_itemTableOrderFieldBy = "DESC";

function updateOrder_itemsTableHeaderSort() {
  $(".sort-icon").addClass("fade-l");
  $(
    "#" + Order_itemTableOrderField + "Sort" + Order_itemTableOrderFieldBy
  ).removeClass("fade-l");
}

function getOrder_items(searchObj) {
  updateOrder_itemsTableHeaderSort();

  const data = {
    offset: Order_itemTableOffset,
    limit: Order_itemTableLimit,
    order: Order_itemTableOrderField,
    order_by: Order_itemTableOrderFieldBy,
    token: Cookies.get("token"),
  };

  if (searchObj) {
    for (key in searchObj) {
      data[key] = searchObj[key];
    }
  }

  $.ajax({
    url: "/pharmacies/getorder_items",
    method: "POST",
    data: data,
    success: function (resultData) {
      console.log(result);
      checkSession(resultData);

      var result = resultData.rows;
      var count = resultData.count;
      $("#order_itemTableBody").html("");

      $("#addOrder_item").html("");
      $("#editOrder_item").html("");

      for (var i = 0; i < result.length; i++) {
        $("#order_itemTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Order_item')" type="checkbox" class=" checkbox-Order_item "  data-id="${
                      result[i].id
                    }" /> </td>
					<td>${result[i] ? (result[i].id ? result[i].id : " ") : " "}</td>
					<td>${result[i] ? (result[i].order_id ? result[i].order_id : " ") : " "}</td>
					<td>${result[i] ? (result[i].drug_code ? result[i].drug_code : " ") : " "}</td>
					<td>${result[i] ? (result[i].quantity ? result[i].quantity : " ") : " "}</td>
					<td>${
            result[i] ? (result[i].returned ? result[i].returned : " ") : " "
          }</td><td><span class="btn btn-link btn-sm" onclick="editOrder_itemModal(  '${
          result[i].order_id
        }', '${result[i].drug_code}', '${result[i].quantity}', '${
          result[i].returned
        }', ${
          result[i].id
        } )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteOrder_itemModal(${
          result[i].id
        })">Delete</span></td>
				          </tr>
				        `);
      }
      getPaginate(
        count,
        changeOrder_itemsTableOffset,
        Order_itemTableLimit,
        Order_itemTableOffset,
        "Order_item"
      );
    },
  });
}

function changeOrder_itemsTableOffset(num) {
  Order_itemTableOffset = num;
  getOrder_items();
}
function changeOrder_itemsTableLimit(num) {
  Order_itemTableLimit = num;
  getOrder_items();
}
function changeOrder_itemsTableOrder(order_field, order_field_by) {
  console.log(order_field, order_field_by);

  Order_itemTableOrderField = order_field;
  Order_itemTableOrderFieldBy = order_field_by;
  getOrder_items();
}

var tempForm = "";
$("#searchOrder_itemForm").on("submit", (ev) => {
  ev.preventDefault();
  console.log(ev);
  tempForm = ev;
  var searchObj = {};
  $("#searchOrder_itemForm")
    .serializeArray()
    .map((i) => {
      if (i.value) searchObj[i.name] = i.value;
    });
  getOrder_items(searchObj);
});

function addOrder_item() {
  $.ajax({
    url: "/pharmacies/addorder_item",
    method: "POST",
    data: {
      order_id: $("#addOrderItemOrderIdInput").val(),
      drug_code: $("#addOrderItemDrugCodeInput").val(),
      quantity: $("#addOrderItemQuantityInput").val(),
      returned: $("#addOrderItemReturnedInput").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      checkSession(result);

      if (result.status == "success") {
        $("#addOrder_itemForm input, #addOrder_itemForm textarea").val("");
        $("#addOrder_itemModal").modal("hide");
        swal({
          title: "Order_item Added successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getOrder_items();
      } else
        swal({
          title: "Unsuccessfully",
          text: result.message,
          icon: "error",
          button: "Okay",
        });
    },
  });
}

$("#addOrder_itemForm").on("submit", (ev) => {
  ev.preventDefault();
  addOrder_item();
});
function addOrder_itemModal() {
  $("#addOrder_itemModal").modal("show");
}

function updateOrder_item() {
  $.ajax({
    url: "/pharmacies/updateorder_item",
    method: "POST",
    data: {
      order_id: $("#editOrderItemOrderIdInput").val(),
      drug_code: $("#editOrderItemDrugCodeInput").val(),
      quantity: $("#editOrderItemQuantityInput").val(),
      returned: $("#editOrderItemReturnedInput").val(),
      id: $("#editOrderItemOrder_itemId").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      checkSession(result);

      if (result.status == "success") {
        $("#editOrder_itemForm input, #editOrder_itemForm textarea").val("");
        $("#editOrder_itemModal").modal("hide");
        swal({
          title: "Order_item Updated successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getOrder_items();
      } else
        swal({
          title: "Unsuccessfully",
          text: result.message,
          icon: "error",
          button: "Okay",
        });
    },
  });
}

function editOrder_itemModal(order_id, drug_code, quantity, returned, id) {
  $("#editOrder_itemModal").modal("show");
  $("#editOrderItemOrder_itemId").val(id);
  $("#editOrderItemOrderIdInput").val(order_id);
  $("#editOrderItemDrugCodeInput").val(drug_code);
  $("#editOrderItemQuantityInput").val(quantity);
  $("#editOrderItemReturnedInput").val(returned);
}
$("#editOrder_itemForm").on("submit", (ev) => {
  ev.preventDefault();
  updateOrder_item();
});

function deleteOrder_item(id) {
  $.ajax({
    url: "/pharmacies/deleteorder_item",
    method: "POST",
    data: {
      id: id,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      checkSession(result);

      if (result.status == "success") {
        swal({
          title: "Order_item Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getOrder_items();
      } else
        swal({
          title: "Unsuccessfully",
          text: result.message,
          icon: "error",
          button: "Okay",
        });
    },
  });
}

async function deleteOrder_itemModal(id) {
  const res = await swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
  console.log(res);
  if (res) {
    deleteOrder_item(id);
  }
}

function bulkDeleteOrder_item(ids) {
  $.ajax({
    url: "/pharmacies/bulkdeleteorder_item",
    method: "POST",
    data: {
      ids: ids,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      checkSession(result);

      if (result.status == "success") {
        swal({
          title: "Order_items Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getOrder_items();
      } else
        swal({
          title: "Unsuccessfully",
          text: result.message,
          icon: "error",
          button: "Okay",
        });
    },
  });
}

async function bulkDeleteOrder_itemModal(ids) {
  const res = await swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
  console.log(res);
  if (res) {
    bulkDeleteOrder_item(ids);
  }
}
