$(document).ready(function () {
  isAllowed().then((res) => {
    getInsurance_companys();
  });
});

var Insurance_companyTableOffset = 0;
var Insurance_companyTableLimit = 10;
var Insurance_companyTableOrderField = "id";
var Insurance_companyTableOrderFieldBy = "DESC";

function updateInsurance_companysTableHeaderSort() {
  $(".sort-icon").addClass("fade-l");
  $(
    "#" +
      Insurance_companyTableOrderField +
      "Sort" +
      Insurance_companyTableOrderFieldBy
  ).removeClass("fade-l");
}

function getInsurance_companys(searchObj) {
  updateInsurance_companysTableHeaderSort();

  const data = {
    offset: Insurance_companyTableOffset,
    limit: Insurance_companyTableLimit,
    order: Insurance_companyTableOrderField,
    order_by: Insurance_companyTableOrderFieldBy,
    token: Cookies.get("token"),
  };

  if (searchObj) {
    for (key in searchObj) {
      data[key] = searchObj[key];
    }
  }

  $.ajax({
    url: "/pharmacies/getinsurance_companies",
    method: "POST",
    data: data,
    success: function (resultData) {
      console.log(result);
      checkSession(resultData);

      var result = resultData.rows;
      var count = resultData.count;
      $("#insurance_companyTableBody").html("");

      $("#addInsurance_company").html("");
      $("#editInsurance_company").html("");

      for (var i = 0; i < result.length; i++) {
        $("#insurance_companyTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Insurance_company')" type="checkbox" class=" checkbox-Insurance_company "  data-id="${
                      result[i].id
                    }" /> </td>
					<td>${result[i] ? (result[i].id ? result[i].id : " ") : " "}</td>
					<td>${
            result[i]
              ? result[i].company_name
                ? result[i].company_name
                : " "
              : " "
          }</td>
					<td>${
            result[i]
              ? result[i].company_id
                ? result[i].company_id
                : " "
              : " "
          }</td>
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
					<td>${result[i] ? (result[i].country ? result[i].country : " ") : " "}</td>
          <td>
          <span class="btn btn-link btn-sm" onclick="editInsurance_companyModal(  '${
            result[i].company_name
          }', '${result[i].company_id}', '${result[i].email}', '${
          result[i].phone
        }', '${result[i].street_address_1}', '${
          result[i].street_address_2
        }', '${result[i].city}', '${result[i].state}', '${result[i].zip}', '${
          result[i].country
        }', ${
          result[i].id
        } )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteInsurance_companyModal(${
          result[i].id
        })">Delete</span></td>
				          </tr>
				        `);
      }

      /**
       *
       *
       *
       *
       *
       */
      getPaginate(
        count,
        changeInsurance_companysTableOffset,
        Insurance_companyTableLimit,
        Insurance_companyTableOffset,
        "Insurance_company"
      );
    },
  });
}

function changeInsurance_companysTableOffset(num) {
  Insurance_companyTableOffset = num;
  getInsurance_companys();
}
function changeInsurance_companysTableLimit(num) {
  Insurance_companyTableLimit = num;
  getInsurance_companys();
}
function changeInsurance_companysTableOrder(order_field, order_field_by) {
  console.log(order_field, order_field_by);

  Insurance_companyTableOrderField = order_field;
  Insurance_companyTableOrderFieldBy = order_field_by;
  getInsurance_companys();
}

var tempForm = "";
$("#searchInsurance_companyForm").on("submit", (ev) => {
  ev.preventDefault();
  console.log(ev);
  tempForm = ev;
  var searchObj = {};
  $("#searchInsurance_companyForm")
    .serializeArray()
    .map((i) => {
      if (i.value) searchObj[i.name] = i.value;
    });
  getInsurance_companys(searchObj);
});

function addInsurance_company() {
  $.ajax({
    url: "/pharmacies/addinsurance_company",
    method: "POST",
    data: {
      company_name: $("#addInsuranceCompanyCompanyNameInput").val(),
      company_id: $("#addInsuranceCompanyCompanyIdInput").val(),
      email: $("#addInsuranceCompanyEmailInput").val(),
      phone: $("#addInsuranceCompanyPhoneInput").val(),
      street_address_1: $("#addInsuranceCompanyStreetAddress1Input").val(),
      street_address_2: $("#addInsuranceCompanyStreetAddress2Input").val(),
      city: $("#addInsuranceCompanyCityInput").val(),
      state: $("#addInsuranceCompanyStateInput").val(),
      zip: $("#addInsuranceCompanyZipInput").val(),
      country: $("#addInsuranceCompanyCountryInput").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      checkSession(result);

      if (result.status == "success") {
        $(
          "#addInsurance_companyForm input, #addInsurance_companyForm textarea"
        ).val("");
        $("#addInsurance_companyModal").modal("hide");
        swal({
          title: "Insurance_company Added successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getInsurance_companys();
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

$("#addInsurance_companyForm").on("submit", (ev) => {
  ev.preventDefault();
  addInsurance_company();
});
function addInsurance_companyModal() {
  $("#addInsurance_companyModal").modal("show");
}

function updateInsurance_company() {
  $.ajax({
    url: "/pharmacies/updateinsurance_company",
    method: "POST",
    data: {
      company_name: $("#editInsuranceCompanyCompanyNameInput").val(),
      company_id: $("#editInsuranceCompanyCompanyIdInput").val(),
      email: $("#editInsuranceCompanyEmailInput").val(),
      phone: $("#editInsuranceCompanyPhoneInput").val(),
      street_address_1: $("#editInsuranceCompanyStreetAddress1Input").val(),
      street_address_2: $("#editInsuranceCompanyStreetAddress2Input").val(),
      city: $("#editInsuranceCompanyCityInput").val(),
      state: $("#editInsuranceCompanyStateInput").val(),
      zip: $("#editInsuranceCompanyZipInput").val(),
      country: $("#editInsuranceCompanyCountryInput").val(),
      id: $("#editInsuranceCompanyInsuranceCompanyId").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      checkSession(result);

      if (result.status == "success") {
        $(
          "#editInsurance_companyForm input, #editInsurance_companyForm textarea"
        ).val("");
        $("#editInsurance_companyModal").modal("hide");
        swal({
          title: "Insurance_company Updated successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getInsurance_companys();
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

function editInsurance_companyModal(
  company_name,
  company_id,
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
  console.log({
    company_name,
    company_id,
    email,
    phone,
    street_address_1,
    street_address_2,
    city,
    state,
    zip,
    country,
    id,
  });
  $("#editInsurance_companyModal").modal("show");
  $("#editInsuranceCompanyInsuranceCompanyId").val(id);
  $("#editInsuranceCompanyCompanyNameInput").val(company_name);
  $("#editInsuranceCompanyCompanyIdInput").val(company_id);
  $("#editInsuranceCompanyEmailInput").val(email);
  $("#editInsuranceCompanyPhoneInput").val(phone);
  $("#editInsuranceCompanyStreetAddress1Input").val(street_address_1);
  $("#editInsuranceCompanyStreetAddress2Input").val(street_address_2);
  $("#editInsuranceCompanyCityInput").val(city);
  $("#editInsuranceCompanyStateInput").val(state);
  $("#editInsuranceCompanyZipInput").val(zip);
  $("#editInsuranceCompanyCountryInput").val(country);
}
$("#editInsurance_companyForm").on("submit", (ev) => {
  ev.preventDefault();
  updateInsurance_company();
});

function deleteInsurance_company(id) {
  $.ajax({
    url: "/pharmacies/deleteinsurance_company",
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
          title: "Insurance_company Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getInsurance_companys();
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

async function deleteInsurance_companyModal(id) {
  const res = await swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
  console.log(res);
  if (res) {
    deleteInsurance_company(id);
  }
}

function bulkDeleteInsurance_company(ids) {
  $.ajax({
    url: "/pharmacies/bulkdeleteinsurance_company",
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
          title: "Insurance_companies Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getInsurance_companys();
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

async function bulkDeleteInsurance_companyModal(ids) {
  const res = await swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
  console.log(res);
  if (res) {
    bulkDeleteInsurance_company(ids);
  }
}
