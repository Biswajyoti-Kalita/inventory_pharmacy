$(document).ready(function () {
  isAllowed().then((res) => {
    getPatient_detailss();
  });
});

var Patient_detailsTableOffset = 0;
var Patient_detailsTableLimit = 10;
var Patient_detailsTableOrderField = "id";
var Patient_detailsTableOrderFieldBy = "DESC";

function updatePatient_detailssTableHeaderSort() {
  $(".sort-icon").addClass("fade-l");
  $(
    "#" +
      Patient_detailsTableOrderField +
      "Sort" +
      Patient_detailsTableOrderFieldBy
  ).removeClass("fade-l");
}

function getPatient_detailss(searchObj) {
  updatePatient_detailssTableHeaderSort();

  const data = {
    offset: Patient_detailsTableOffset,
    limit: Patient_detailsTableLimit,
    order: Patient_detailsTableOrderField,
    order_by: Patient_detailsTableOrderFieldBy,
    token: Cookies.get("token"),
  };

  if (searchObj) {
    for (key in searchObj) {
      data[key] = searchObj[key];
    }
  }

  $.ajax({
    url: "/pharmacies/getpatient_detailss",
    method: "POST",
    data: data,
    success: function (resultData) {
      console.log(result);
      checkSession(resultData);
      var result = resultData.rows;
      var count = resultData.count;
      $("#patient_detailsTableBody").html("");

      $("#addPatient_details").html("");
      $("#editPatient_details").html("");

      for (var i = 0; i < result.length; i++) {
        $("#patient_detailsTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Patient_details')" type="checkbox" class=" checkbox-Patient_details "  data-id="${
                      result[i].id
                    }" /> </td>
					<td>${result[i] ? (result[i].id ? result[i].id : " ") : " "}</td>
					<td>${
            result[i]
              ? result[i].first_name
                ? result[i].first_name
                : " "
              : " "
          }</td>
					<td>${
            result[i]
              ? result[i].middle_name
                ? result[i].middle_name
                : " "
              : " "
          }</td>
					<td>${result[i] ? (result[i].last_name ? result[i].last_name : " ") : " "}</td>
					<td>${result[i] ? (result[i].dob ? result[i].dob : " ") : " "}</td>
					<td>${result[i] ? (result[i].email ? result[i].email : " ") : " "}</td>
					<td>${result[i] ? (result[i].phone ? result[i].phone : " ") : " "}</td>
					<td>${
            result[i]
              ? result[i].street_address_1
                ? result[i].street_address_1
                : " "
              : " "
          }</td>
					<td>${
            result[i]
              ? result[i].street_address_2
                ? result[i].street_address_2
                : " "
              : " "
          }</td>
					<td>${result[i] ? (result[i].city ? result[i].city : " ") : " "}</td>
					<td>${result[i] ? (result[i].state ? result[i].state : " ") : " "}</td>
					<td>${result[i] ? (result[i].zip ? result[i].zip : " ") : " "}</td>
					<td>${
            result[i] ? (result[i].country ? result[i].country : " ") : " "
          }</td><td><span class="btn btn-link btn-sm" onclick="editPatient_detailsModal(  '${
          result[i].name
        }', '${result[i].dob}', '${result[i].email}', '${result[i].phone}', '${
          result[i].street_address_1
        }', '${result[i].street_address_2}', '${result[i].city}', '${
          result[i].state
        }', '${result[i].zip}', '${result[i].country}', ${
          result[i].id
        } )">Edit</span><span class="btn btn-link btn-sm" onclick="deletePatient_detailsModal(${
          result[i].id
        })">Delete</span></td>
				          </tr>
				        `);
      }
      getPaginate(
        count,
        changePatient_detailssTableOffset,
        Patient_detailsTableLimit,
        Patient_detailsTableOffset,
        "Patient_details"
      );
    },
  });
}

function changePatient_detailssTableOffset(num) {
  Patient_detailsTableOffset = num;
  getPatient_detailss();
}
function changePatient_detailssTableLimit(num) {
  Patient_detailsTableLimit = num;
  getPatient_detailss();
}
function changePatient_detailssTableOrder(order_field, order_field_by) {
  console.log(order_field, order_field_by);

  Patient_detailsTableOrderField = order_field;
  Patient_detailsTableOrderFieldBy = order_field_by;
  getPatient_detailss();
}

var tempForm = "";
$("#searchPatient_detailsForm").on("submit", (ev) => {
  ev.preventDefault();
  console.log(ev);
  tempForm = ev;
  var searchObj = {};
  $("#searchPatient_detailsForm")
    .serializeArray()
    .map((i) => {
      if (i.value) searchObj[i.name] = i.value;
    });
  getPatient_detailss(searchObj);
});

function addPatient_details() {
  return;
  $.ajax({
    url: "/pharmacies/addpatient_details",
    method: "POST",
    data: {
      name: $("#addPatientDetailsNameInput").val(),
      dob: $("#addPatientDetailsDobInput").val(),
      email: $("#addPatientDetailsEmailInput").val(),
      phone: $("#addPatientDetailsPhoneInput").val(),
      street_address_1: $("#addPatientDetailsStreetAddress1Input").val(),
      street_address_2: $("#addPatientDetailsStreetAddress2Input").val(),
      city: $("#addPatientDetailsCityInput").val(),
      state: $("#addPatientDetailsStateInput").val(),
      zip: $("#addPatientDetailsZipInput").val(),
      country: $("#addPatientDetailsCountryInput").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        $(
          "#addPatient_detailsForm input, #addPatient_detailsForm textarea"
        ).val("");
        $("#addPatient_detailsModal").modal("hide");
        swal({
          title: "Patient_details Added successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getPatient_detailss();
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

$("#addPatient_detailsForm").on("submit", (ev) => {
  ev.preventDefault();
  addPatient_details();
});
function addPatient_detailsModal() {
  $("#addPatient_detailsModal").modal("show");
}

function updatePatient_details() {
  return;
  $.ajax({
    url: "/pharmacies/updatepatient_details",
    method: "POST",
    data: {
      name: $("#editPatientDetailsNameInput").val(),
      dob: $("#editPatientDetailsDobInput").val(),
      email: $("#editPatientDetailsEmailInput").val(),
      phone: $("#editPatientDetailsPhoneInput").val(),
      street_address_1: $("#editPatientDetailsStreetAddress1Input").val(),
      street_address_2: $("#editPatientDetailsStreetAddress2Input").val(),
      city: $("#editPatientDetailsCityInput").val(),
      state: $("#editPatientDetailsStateInput").val(),
      zip: $("#editPatientDetailsZipInput").val(),
      country: $("#editPatientDetailsCountryInput").val(),
      id: $("#editPatientDetailsPatient_detailsId").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        $(
          "#editPatient_detailsForm input, #editPatient_detailsForm textarea"
        ).val("");
        $("#editPatient_detailsModal").modal("hide");
        swal({
          title: "Patient_details Updated successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getPatient_detailss();
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

function editPatient_detailsModal(
  name,
  dob,
  email,
  phone,
  street_address_1,
  street_address_2,
  city,
  state,
  zip,
  country,
  id
) {
  return;
  $("#editPatient_detailsModal").modal("show");
  $("#editPatientDetailsPatient_detailsId").val(id);
  $("#editPatientDetailsNameInput").val(name);
  $("#editPatientDetailsDobInput").val(dob);
  $("#editPatientDetailsEmailInput").val(email);
  $("#editPatientDetailsPhoneInput").val(phone);
  $("#editPatientDetailsStreetAddress1Input").val(street_address_1);
  $("#editPatientDetailsStreetAddress2Input").val(street_address_2);
  $("#editPatientDetailsCityInput").val(city);
  $("#editPatientDetailsStateInput").val(state);
  $("#editPatientDetailsZipInput").val(zip);
  $("#editPatientDetailsCountryInput").val(country);
}
$("#editPatient_detailsForm").on("submit", (ev) => {
  ev.preventDefault();
  updatePatient_details();
});

function deletePatient_details(id) {
  return;
  $.ajax({
    url: "/pharmacies/deletepatient_details",
    method: "POST",
    data: {
      id: id,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Patient_details Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getPatient_detailss();
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

async function deletePatient_detailsModal(id) {
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
    deletePatient_details(id);
  }
}

function bulkDeletePatient_details(ids) {
  $.ajax({
    url: "/pharmacies/bulkdeletepatient_details",
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
          title: "Patient_details Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getPatient_detailss();
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

async function bulkDeletePatient_detailsModal(ids) {
  const res = await swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
  console.log(res);
  if (res) {
    bulkDeletePatient_details(ids);
  }
}
