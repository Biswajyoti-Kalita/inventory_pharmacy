let hospitals = {};

$(document).ready(function () {
  fetch("/pharmacies/gethospitals", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      token: Cookies.get("token"),
    },
  })
    .then((response) => response.json())
    .then(function (data) {
      data?.data?.map((item) => {
        hospitals[item.id] = { ...item };
      });
      getOrders();
    });

  getHospitalDepartments();
});
async function getHospitalDepartments() {
  const data = await fetch("/pharmacies/get_all_hospital_departments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: Cookies.get("token"),
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });

  $("#filter_hospital_department").html(`<option value="" >All</option>`);
  if (data) {
    data?.map((item) => {
      $("#filter_hospital_department").append(
        `<option value="${item.id}" >${item.name}</option>`
      );
    });
  }
}

var OrderTableOffset = 0;
var OrderTableLimit = 10;
var OrderTableOrderField = "id";
var OrderTableOrderFieldBy = "DESC";

function updateOrdersTableHeaderSort() {
  $(".sort-icon").addClass("fade-l");
  $("#" + OrderTableOrderField + "Sort" + OrderTableOrderFieldBy).removeClass(
    "fade-l"
  );
}

function getOrders(searchObj) {
  updateOrdersTableHeaderSort();

  const data = {
    offset: OrderTableOffset,
    limit: OrderTableLimit,
    order: OrderTableOrderField,
    order_by: OrderTableOrderFieldBy,
    token: Cookies.get("token"),
  };

  if (searchObj) {
    for (key in searchObj) {
      data[key] = searchObj[key];
    }
  }

  $.ajax({
    url: "/pharmacies/getorders",
    method: "POST",
    data: data,
    success: function (resultData) {
      console.log(result);
      var result = resultData.rows;
      var count = resultData.count;
      $("#orderTableBody").html("");

      $("#addOrder").html("");
      $("#editOrder").html("");

      for (var i = 0; i < result.length; i++) {
        let dispenseBtn = "";
        let payment_information = "";

        if (result[i].payment_type == 1) {
          payment_information = `
            Cheque no: ${result[i].cheque_no ? result[i].cheque_no : ""} <br />
            Cheque date: ${
              result[i].cheque_date ? result[i].cheque_date : ""
            } <br />
            Bank name: ${result[i].bank_name ? result[i].bank_name : ""} <br />
            Acount name: ${
              result[i].account_holder_name ? result[i].account_holder_name : ""
            }
          `;
        } else if (result[i].payment_type == 2) {
          payment_information = `
            Trnx Id : ${
              result[i].transaction_id ? result[i].transaction_id : ""
            }
          `;
        } else if (result[i].payment_type == 3 && result[i].insurance_company) {
          payment_information = `
          Insurance no : ${result[i].patient_insurance_id} <br />
          Insurance company : ${
            result[i].insurance_company
              ? result[i].insurance_company.company_name
              : ""
          } 

          `;
        }

        if (result[i].status == 0) {
          dispenseBtn = `<span class="btn btn-sm btn-success" onclick="dispenseDrug(${result[i].id})"  >Dispense</span>`;
        } else if (result[i].status == 3) {
          dispenseBtn = `<span class="btn btn-sm btn-success" onclick="acceptOrderItem(${result[i].id})"  >Accept</span>`;
        } else if (result[i].status == 4) {
          dispenseBtn = `<span class="btn btn-sm btn-success" onclick="dispenseOrderItem(${result[i].id},${result[i].amount})"  >Dispense</span>`;
        }

        $("#orderTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Order')" type="checkbox" class=" checkbox-Order "  data-id="${
                      result[i].id
                    }" /> </td>
					<td>${result[i] ? (result[i].id ? result[i].id : " ") : " "}</td>
					<td>${
            result[i]
              ? result[i].order_type != null
                ? ["Patient", "Hospital"][result[i].order_type]
                : " "
              : " "
          }</td>

					<td>${result[i] ? (result[i].hospital_id ? result[i].hospital_id : " ") : " "}
          
          ${
            hospitals[result[i].hospital_id]
              ? "(" + hospitals[result[i].hospital_id].name + ")"
              : ""
          }
          </td>
					<td>${
            result[i]
              ? result[i].hospital_department
                ? result[i].hospital_department.name
                : " "
              : " "
          }</td>

          <td>${
            result[i]
              ? result[i].hospital_prescription_id
                ? result[i].hospital_prescription_id
                : " "
              : " "
          }</td>
					<td>${
            result[i]
              ? result[i].patient_details
                ? result[i].patient_details.first_name +
                  " " +
                  result[i].patient_details.middle_name +
                  " " +
                  result[i].patient_details.last_name
                : " "
              : " "
          }</td>
					<td>${result[i] ? (result[i].discount ? result[i].discount : " ") : " "}</td>
					<td>${result[i] ? (result[i].amount ? result[i].amount : " ") : " "}</td>
					<td>${
            result[i]
              ? result[i].amount
                ? parseFloat(result[i].amount) -
                  (result[i].discount ? parseFloat(result[i].discount) : 0)
                : " "
              : " "
          }</td>
					<td>${
            result[i]
              ? result[i].payment_type != null
                ? ["Cash", "Cheque", "Online", "Insurance"][
                    result[i].payment_type
                  ]
                : " "
              : " "
          }</td>

					<td>${payment_information}</td>          
					<td>${
            result[i]
              ? result[i].additional_information
                ? result[i].additional_information
                : " "
              : " "
          }</td>
					<td>${
            result[i]
              ? result[i].status != null
                ? [
                    "Ordered",
                    "Delivered",
                    "Cancelled",
                    "Requested",
                    "Accepted",
                  ][result[i].status]
                : " "
              : " "
          }</td><td>
		  
		  ${dispenseBtn}
      <span class="btn-link cursor-p" onclick="getOrderItems(${
        result[i].id
      })" >Order items </span>
		 
		  <span class="btn btn-link btn-sm hide" onclick="editOrderModal(  '${
        result[i].uuid
      }', '${result[i].has_prescription}', '${result[i].hospital_id}', '${
          result[i].hospital_prescription_id
        }', '${result[i].hospital_patient_id}', '${
          result[i].patient_details_id
        }', '${result[i].discount}', '${result[i].status}', '${
          result[i].order_date
        }', ${
          result[i].id
        } )">Edit</span><span class="btn btn-link btn-sm hide" onclick="deleteOrderModal(${
          result[i].id
        })">Delete</span></td>
				          </tr>
				        `);
      }
      getPaginate(
        count,
        changeOrdersTableOffset,
        OrderTableLimit,
        OrderTableOffset,
        "Order"
      );
    },
  });
}

function changeOrdersTableOffset(num) {
  OrderTableOffset = num;
  getOrders();
}
function changeOrdersTableLimit(num) {
  OrderTableLimit = num;
  getOrders();
}
function changeOrdersTableOrder(order_field, order_field_by) {
  console.log(order_field, order_field_by);

  OrderTableOrderField = order_field;
  OrderTableOrderFieldBy = order_field_by;
  getOrders();
}

var tempForm = "";
$("#searchOrderForm").on("submit", (ev) => {
  ev.preventDefault();
  console.log(ev);
  tempForm = ev;
  var searchObj = {};
  $("#searchOrderForm")
    .serializeArray()
    .map((i) => {
      if (i.value) searchObj[i.name] = i.value;
    });
  getOrders(searchObj);
});

function addOrder() {
  $.ajax({
    url: "/pharmacies/addorder",
    method: "POST",
    data: {
      uuid: $("#addOrderUuidInput").val(),
      has_prescription: $("#addOrderHasPrescriptionInput").val(),
      hospital_id: $("#addOrderHospitalIdInput").val(),
      hospital_prescription_id: $("#addOrderHospitalPrescriptionIdInput").val(),
      hospital_patient_id: $("#addOrderHospitalPatientIdInput").val(),
      patient_details_id: $("#addOrderPatientDetailsIdInput").val(),
      discount: $("#addOrderDiscountInput").val(),
      status: $("#addOrderStatusInput").val(),
      order_date: $("#addOrderOrderDateInput").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        $("#addOrderForm input, #addOrderForm textarea").val("");
        $("#addOrderModal").modal("hide");
        swal({
          title: "Order Added successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getOrders();
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

$("#addOrderForm").on("submit", (ev) => {
  ev.preventDefault();
  addOrder();
});
function addOrderModal() {
  $("#addOrderModal").modal("show");
}

function updateOrder() {
  $.ajax({
    url: "/pharmacies/updateorder",
    method: "POST",
    data: {
      uuid: $("#editOrderUuidInput").val(),
      has_prescription: $("#editOrderHasPrescriptionInput").val(),
      hospital_id: $("#editOrderHospitalIdInput").val(),
      hospital_prescription_id: $(
        "#editOrderHospitalPrescriptionIdInput"
      ).val(),
      hospital_patient_id: $("#editOrderHospitalPatientIdInput").val(),
      patient_details_id: $("#editOrderPatientDetailsIdInput").val(),
      discount: $("#editOrderDiscountInput").val(),
      status: $("#editOrderStatusInput").val(),
      order_date: $("#editOrderOrderDateInput").val(),
      id: $("#editOrderOrderId").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        $("#editOrderForm input, #editOrderForm textarea").val("");
        $("#editOrderModal").modal("hide");
        swal({
          title: "Order Updated successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getOrders();
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

function editOrderModal(
  uuid,
  has_prescription,
  hospital_id,
  hospital_prescription_id,
  hospital_patient_id,
  patient_details_id,
  discount,
  status,
  order_date,
  id
) {
  return;
  $("#editOrderModal").modal("show");
  $("#editOrderOrderId").val(id);
  $("#editOrderUuidInput").val(uuid);
  $("#editOrderHasPrescriptionInput").val(has_prescription);
  $("#editOrderHospitalIdInput").val(hospital_id);
  $("#editOrderHospitalPrescriptionIdInput").val(hospital_prescription_id);
  $("#editOrderHospitalPatientIdInput").val(hospital_patient_id);
  $("#editOrderPatientDetailsIdInput").val(patient_details_id);
  $("#editOrderDiscountInput").val(discount);
  $("#editOrderStatusInput").val(status);
  $("#editOrderOrderDateInput").val(order_date);
}
$("#editOrderForm").on("submit", (ev) => {
  ev.preventDefault();
  updateOrder();
});

function deleteOrder(id) {
  return;
  $.ajax({
    url: "/pharmacies/deleteorder",
    method: "POST",
    data: {
      id: id,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Order Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getOrders();
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

async function deleteOrderModal(id) {
  return;
  const res = await swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
  console.log(res);
  if (res) {
    deleteOrder(id);
  }
}

function bulkDeleteOrder(ids) {
  $.ajax({
    url: "/pharmacies/bulkdeleteorder",
    method: "POST",
    data: {
      ids: ids,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Orders Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getOrders();
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

async function bulkDeleteOrderModal(ids) {
  const res = await swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
  console.log(res);
  if (res) {
    bulkDeleteOrder(ids);
  }
}

function dispenseDrug(id) {
  $.ajax({
    url: "/pharmacies/dispenseorder",
    method: "POST",
    data: {
      id: id,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Order Dispensed successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getOrders();
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

function getOrderItems(order_id) {
  $.ajax({
    url: "/pharmacies/get_all_order_items",
    method: "POST",
    data: {
      order_id,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);

      $("#orderItemTableBody").html("");
      result?.map((item, ind) => {
        $("#orderItemTableBody").append(`
          <tr>
          <td> ${ind + 1} </td>
          <td> ${item.drug_code} </td>
          <td> ${item.drug_name} </td>
          <td> ${item.quantity} </td>
          <td> ${item.price} </td>
          </tr>
        `);
      });
      $("#orderItemModal").modal("show");
    },
  });
}
function acceptOrderItem(order_id) {
  $.ajax({
    url: "/pharmacies/accept_order_items",
    method: "POST",
    data: {
      order_id,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Order accepted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getOrders();
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
function dispenseOrderItem(order_id, total_amount) {
  $("#orderConfirmModal").modal("show");
  $("#acceptOrderId").val(order_id);
  $("#acceptOrderId2").text(order_id);
  $("#acceptOrderAmount").text(total_amount);
}
function paymentTypeChanged(val) {
  $(".pm").addClass("hide");
  if (val == 1) {
    $(".pm-cheque").removeClass("hide");
  } else if (val == 2) {
    $(".pm-online").removeClass("hide");
  }
}

function submitAcceptForm() {
  $.ajax({
    url: "/pharmacies/dispense_order_items",
    method: "POST",
    data: {
      order_id: $("#acceptOrderId").val(),
      payment_type: $("#payment_type").val(),
      cheque_no: $("#pm_cheque_no").val(),
      bank_name: $("#pm_bank_name").val(),
      account_holder_name: $("#pm_ac_holder_name").val(),
      cheque_date: $("#pm_cheque_date").val(),
      transaction_id: $("#pm_transaction_id").val(),
      additional_information: $("#additional_information").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Order Item accepted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getOrders();
        $("#orderConfirmModal").modal("hide");
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
