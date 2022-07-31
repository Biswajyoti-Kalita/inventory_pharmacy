$(document).ready(function () {
  isAllowed().then((res) => {
    getHospitals();
    getInsuranceCompanies();
  });
});
let cartItems = [];
let cartItemDetails = {};
var cartPrescriptionTableOffset = 0;
var cartPrescriptionTableLimit = 10;

function getInsuranceCompanies() {
  fetch("/pharmacies/getall_insurance_companies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: Cookies.get("token"),
    },
  })
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
      checkSession(data);
      $("#pm_insurance_company_id").html("");
      data?.map((item) => {
        $("#pm_insurance_company_id").append(
          `<option value="${item.id}" >${item.company_name}</option>`
        );
      });
    });
}

function getHospitals() {
  fetch("/pharmacies/gethospitals", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      token: Cookies.get("token"),
    },
  })
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
      checkSession(data);
      if (data.data && data.data[0]) {
        $("#cartHospitalId").html(`<option value="">Select Hospital</option>`);
        data.data.map((item) => {
          $("#cartHospitalId").append(
            `<option value="${item.id}" >${item.name}</option>`
          );
        });
      }
    });
}

function getPatient(hospital_patient_id) {
  let data = {
    hospital_patient_id,
    hospital_id: $("#cartHospitalId").val(),
  };
  fetch("/pharmacies/findpatient_details", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: Cookies.get("token"),
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
      checkSession(data);
      if (data) {
        $("#cartPatientId").val(data.id);
        $("#cartPatientFirstName").val(data.first_name ? data.first_name : "");
        $("#cartPatientMiddleName").val(
          data.middle_name ? data.middle_name : ""
        );
        $("#cartPatientLastName").val(data.last_name ? data.last_name : "");
        $("#cartPatientStreetAddress").val(
          data.street_address_1 ? data.street_address_1 : ""
        );
        $("#cartPatientDOB").val(data.dob);
        $("#cartPatientPhone").val(data.phone);
        $("#cartPatientEmail").val(data.email);
        $("#cartPatientCity").val(data.city);
        $("#cartPatientState").val(data.state);
        $("#cartPatientZip").val(data.zip);
      }
    });
}

function submitPrescription() {
  getPrescription($("#cartPrescriptionId").val());
}
function getPrescription(id) {
  let data = {
    hospital_prescription_id: id,
    hospital_id: $("#cartHospitalId").val(),
    limit: 1,
    offset: 0,
  };
  $("#cartPrescriptionDrugs").html("");
  fetch("/pharmacies/getprescription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: Cookies.get("token"),
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then(function (data) {
      console.log("fill data", data);
      checkSession(data);

      let content = "";

      if (data && data.drugs && data.drugs[0]) {
        content += `<table class="table"><tr><td>Drug</td><td>Refills Balance</td><td>Action</td></tr>`;

        for (let i = 0; i < data.drugs.length; i++) {
          let btnText = "";

          if (
            data.drugs[i].refills_balance != null &&
            data.drugs[i].refills_balance > 0
          ) {
            btnText = `<button class="btn btn-sm btn-primary" onclick="addToCart('${data.drugs[i].drug_code}')" >Add</button>`;
          }
          content += `<tr>
            <td>${data.drugs[i].drug_code}</td>
            <td>${data.drugs[i].refills_balance}</td>
            <td> ${btnText}  </td>
          `;
        }
        content += "</table>";
        $("#cartPrescriptionDrugs").html(content);
      }

      if (data) {
        $("#cartPatientFirstName").val(
          data.patient_first_name ? data.patient_first_name : ""
        );
        $("#cartPatientMiddleName").val(
          data.patient_middle_name ? data.patient_middle_name : ""
        );
        $("#cartPatientLastName").val(
          data.patient_last_name ? data.patient_last_name : ""
        );
        $("#cartPatientHospitalId").val(data.hospital_id);
        $("#cartPatientHospitalPatientId").val(data.hospital_patient_id);
      }

      getPatient(data.hospital_patient_id);
    });
}

function getPrescriptions() {
  let data = {
    hospital_id: $("#cartHospitalId").val(),
    first_name: $("#search_patient_first_name").val(),
    middle_name: $("#search_patient_middle_name").val(),
    last_name: $("#search_patient_last_name").val(),
    street_address: $("#search_patient_street_address").val(),
    city: $("#search_patient_city").val(),
    state: $("#search_patient_state").val(),
    zip: $("#search_patient_zip").val(),
    limit: cartPrescriptionTableLimit,
    offset: cartPrescriptionTableOffset,
  };
  fetch("/pharmacies/getprescriptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: Cookies.get("token"),
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
      checkSession(data);

      $("#cartPrescriptionTableBody").html("");
      if (data) {
        data?.data?.map((item, ind) => {
          $("#cartPrescriptionTableBody").append(`
            <tr>
              <td>
                <span class="btn btn-sm btn-info" onclick=selectPrescription(${
                  item.hospital_prescription_id
                }) >SELECT</span>
              </td>
            <td>${
              item.hospital_prescription_id ? item.hospital_prescription_id : ""
            }</td>
            <td>${item.doctor_first_name ? item.doctor_first_name : ""}
              
              ${item.doctor_middle_name ? item.doctor_middle_name : ""}
  
              ${item.doctor_last_name ? item.doctor_last_name : ""}
              
            </td>
            <td>${item.patient_first_name ? item.patient_first_name : ""}</td>
            <td>${item.patient_middle_name ? item.patient_middle_name : ""}</td>
            <td>${item.patient_last_name ? item.patient_last_name : ""}</td>
            <td>${item.street_address ? item.street_address : ""}</td>
            <td>${item.city ? item.city : ""}</td>
            <td>${item.state ? item.state : ""}</td>
            <td>${item.zip ? item.zip : ""}</td>
            </tr>
          
          `);
        });

        getPaginate(
          data.count,
          changeCartPrescriptionTableOffset,
          cartPrescriptionTableLimit,
          cartPrescriptionTableOffset,
          "CartPrescription"
        );
      }
    });
}
function changeCartPrescriptionTableOffset(num) {
  cartPrescriptionTableOffset = num;
  getPrescriptions();
}

function findPrescription() {
  $("#findPrescriptionModal").modal("show");
  cartPrescriptionTableOffset = 0;
  cartPrescriptionTableLimit = 20;
  getPrescriptions();
}
$("#cartHospitalType").on("change", (ev) => {
  console.log(ev?.target?.value);
  if (ev.target && ev.target.value && ev.target.value == 1) {
    $(".hp").removeClass("hide");
  } else {
    $(".hp").addClass("hide");
  }
});
function selectPrescription(hospital_prescription_id) {
  $("#cartPrescriptionId").val(hospital_prescription_id);
  getPrescription(hospital_prescription_id);
  $("#findPrescriptionModal").modal("hide");
}

async function addToCart(drug_code) {
  const data = await fetch("/pharmacies/getdrug", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      drug_code,
      token: Cookies.get("token"),
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
  checkSession(data);
  console.log("Data ", data);
  if (data && data.id) {
    if (cartItems.indexOf(drug_code) < 0) {
      cartItems.push(drug_code);
      cartItemDetails[drug_code] = {
        drug_name: data.drug_name,
        total_price: data.selling_price,
        selling_price: data.selling_price,
        quantity: 1,
      };
      calculateTotalPrice();
      $("#cartDrugTableBody").append(`
          <tr id="cartDrug${drug_code}">
            <td><span class="btn btn-sm btn-danger" onclick="removeCartDrug('${drug_code}')" >&times;</span></td>
            <td>  ${drug_code}</td>
            <td>${data.drug_name}  </td>
            <td> <input type="number" value="1" min="0" max="${data.available_quantity}"  onchange="updateQuantity(this.value,'${drug_code}',this)" /> <input type="hidden" id="cartDrugSellingPrice${drug_code}" value="${data.selling_price}" /> </td>
            <td><span>${data.selling_price}</span> </td>
            <td><span id="cartDrugTotalSelling${drug_code}" >${data.selling_price}</span> </td>
          </tr>
        `);
      scrollToBottom();
    } else {
      swal("Error", "Item already added", "error");
    }
  } else {
    swal("Error", "drug code does not exist", "error");
  }
}

function updateQuantity(val, drugCode, _this) {
  if (parseInt(val) > parseInt(_this.max)) {
    _this.value = _this.max;
    val = parseInt(_this.max);
  }

  let sp = $("#cartDrugSellingPrice" + drugCode).val();
  console.log("quan ", val, " sp ", sp);
  $("#cartDrugTotalSelling" + drugCode).text(sp * val);
  cartItemDetails[drugCode].quantity = val;
  cartItemDetails[drugCode].total_price =
    val * cartItemDetails[drugCode].selling_price;
  calculateTotalPrice();
}
function calculateTotalPrice() {
  let totalPrice = 0;
  let grandTotal = 0;
  for (let item in cartItemDetails) {
    console.log("item found ", cartItemDetails[item]);
    totalPrice += cartItemDetails[item].total_price;
  }
  console.log("total price is ", totalPrice);

  grandTotal = totalPrice;
  $("#cartPaymentTotalAmount").text(totalPrice);
  let discount = $("#cartPaymentDiscount").val();
  if (discount && parseInt(discount) > 0) {
    grandTotal = grandTotal - discount;
  }
  $("#cartPaymentGrandTotalAmount").text(grandTotal);
}
function removeCartDrug(drugCode) {
  $("#cartDrug" + drugCode).remove();
  cartItems = cartItems.filter((item) => {
    if (item != drugCode) return item;
  });
  delete cartItemDetails[drugCode];
}

//

var DrugTableOffset = 0;
var DrugTableLimit = 10;
var DrugTableOrderField = "id";
var DrugTableOrderFieldBy = "DESC";

function showDrugModal() {
  $("#findDrugModal").modal("show");
  getDrugs();
}
async function getDrug(drug_code) {
  const data = await fetch("/pharmacies/getdrug", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      drug_code,
      token: Cookies.get("token"),
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
  console.log(data);
  checkSession(data);
  if (cartItems.indexOf(drug_code) < 0) {
    cartItems.push(drug_code);
    cartItemDetails[drug_code] = {
      drug_name: data.drug_name,
      total_price: data.selling_price,
      selling_price: data.selling_price,
      quantity: 1,
    };
    calculateTotalPrice();
    $("#cartDrugTableBody").append(`
          <tr id="cartDrug${drug_code}">
            <td> <span class="btn btn-sm btn-danger" onclick="removeCartDrug('${drug_code}')" >&times;</span> </td>
            <td>${drug_code}</td>
            <td>${data.drug_name}  </td>
            <td> <input type="number" value="1" min="0" max="${data.available_quantity}" onchange="updateQuantity(this.value,'${drug_code}',this)" /> <input type="hidden" id="cartDrugSellingPrice${drug_code}" value="${data.selling_price}" /> </td>
            <td><span>${data.selling_price}</span> </td>
            <td><span id="cartDrugTotalSelling${drug_code}" >${data.selling_price}</span> </td>
          </tr>
        `);
    scrollToBottom();
  } else {
    swal("Error", "Item already added", "error");
  }
}

function getDrugs(searchObj) {
  const data = {
    offset: DrugTableOffset,
    limit: DrugTableLimit,
    order: DrugTableOrderField,
    order_by: DrugTableOrderFieldBy,
    token: Cookies.get("token"),
  };

  if (searchObj) {
    for (key in searchObj) {
      data[key] = searchObj[key];
    }
  }

  $.ajax({
    url: "/pharmacies/getdrugs",
    method: "POST",
    data: data,
    success: function (resultData) {
      console.log(result);
      checkSession(resultData);
      var result = resultData.rows;
      var count = resultData.count;
      $("#searchDrugTableBody").html("");

      for (var i = 0; i < result.length; i++) {
        $("#searchDrugTableBody").append(`
				          <tr>
				          	<td> <span onclick="selectDrug('${
                      result[i].drug_code
                    }')" class="btn btn-sm btn-info" >Select</span> </td>
					<td>${result[i] ? (result[i].drug_code ? result[i].drug_code : " ") : " "}</td>
					<td>${result[i] ? (result[i].drug_name ? result[i].drug_name : " ") : " "}</td>
					<td>${
            result[i]
              ? result[i].medication
                ? result[i].medication
                : " "
              : " "
          }</td>
					<td>${
            result[i]
              ? result[i].ingredient
                ? result[i].ingredient
                : " "
              : " "
          }</td>
					<td>${
            result[i]
              ? result[i].semantic_brand_name
                ? result[i].semantic_brand_name
                : " "
              : " "
          }</td>
					<td>${
            result[i]
              ? result[i].selling_price
                ? result[i].selling_price
                : " "
              : " "
          }</td>
				          </tr>
				        `);
      }
      getPaginate(
        count,
        changeDrugsTableOffset,
        DrugTableLimit,
        DrugTableOffset,
        "SearchDrug"
      );
    },
  });
}

function changeDrugsTableOffset(num) {
  DrugTableOffset = num;
  getDrugs();
}

function selectDrug(drug_code) {
  getDrug(drug_code);
  $("#findDrugModal").modal("hide");
}

// PATIENT DETAILS CRUD

var PatientDetailsTableOffset = 0;
var PatientDetailsTableLimit = 10;
var PatientDetailsTableOrderField = "id";
var PatientDetailsTableOrderFieldBy = "DESC";

function showPatientDetailsModal() {
  $("#findPatientDetailsModal").modal("show");
  getPatientDetailss();
}
async function getPatientDetails(id) {
  const data = await fetch("/pharmacies/getpatient_details", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      token: Cookies.get("token"),
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
  console.log(data);
  checkSession(data);
  if (data) {
    $("#cartPatientId").val(data.id);
    $("#cartPatientFirstName").val(data.first_name ? data.first_name : "");
    $("#cartPatientMiddleName").val(data.middle_name ? data.middle_name : "");
    $("#cartPatientLastName").val(data.last_name ? data.last_name : "");
    $("#cartPatientStreetAddress").val(
      data.street_address_1 ? data.street_address_1 : ""
    );
    $("#cartPatientDOB").val(data.dob);
    $("#cartPatientPhone").val(data.phone);
    $("#cartPatientEmail").val(data.email);
    $("#cartPatientCity").val(data.city);
    $("#cartPatientState").val(data.state);
    $("#cartPatientZip").val(data.zip);
  }
}

function getPatientDetailss(searchObj) {
  const data = {
    offset: PatientDetailsTableOffset,
    limit: PatientDetailsTableLimit,
    order: PatientDetailsTableOrderField,
    order_by: PatientDetailsTableOrderFieldBy,
    token: Cookies.get("token"),
    first_name: $("#search_patient_details_first_name").val(),
    middle_name: $("#search_patient_details_middle_name").val(),
    last_name: $("#search_patient_details_last_name").val(),
    dob_year: $("#search_patient_details_dob_year").val(),
    dob_month: $("#search_patient_details_dob_month").val(),
    dob_day: $("#search_patient_details_dob_day").val(),
    phone: $("#search_patient_details_phone").val(),
    email: $("#search_patient_details_email").val(),
    street_address_1: $("#search_patient_details_street_address_1").val(),
    city: $("#search_patient_details_city").val(),
    state: $("#search_patient_details_state").val(),
    zip: $("#search_patient_details_zip").val(),
  };

  $.ajax({
    url: "/pharmacies/getpatient_detailss",
    method: "POST",
    data: data,
    success: function (resultData) {
      checkSession(resultData);
      console.log(result);
      var result = resultData.rows;
      var count = resultData.count;
      $("#searchPatientDetailsTableBody").html("");

      for (var i = 0; i < result.length; i++) {
        $("#searchPatientDetailsTableBody").append(`
          <tr>
            <td> 
              <span onclick="selectPatientDetails('${
                result[i].id
              }')" class="btn btn-sm btn-info" >
                Select
              </span> 
            </td>
            <td>${result[i].first_name ? result[i].first_name : ""} ${
          result[i].middle_name ? result[i].middle_name : ""
        } ${result[i].last_name ? result[i].last_name : ""} </td>
          <td>${result[i].dob ? result[i].dob : " "}</td>
          <td>${result[i].phone ? result[i].phone : " "}</td>
          <td>${
            result[i].street_address_1 ? result[i].street_address_1 : " "
          }</td>
          <td>${result[i].email ? result[i].email : " "}</td>
          <td>${result[i].city ? result[i].city : " "}</td>
          <td>${result[i].state ? result[i].state : " "}</td>
          <td>${result[i].zip ? result[i].zip : " "}</td>
        </tr>
      `);
      }
      getPaginate(
        count,
        changePatientDetailsTableOffset,
        PatientDetailsTableLimit,
        PatientDetailsTableOffset,
        "SearchPatientDetails"
      );
    },
  });
}

function changePatientDetailsTableOffset(num) {
  PatientDetailsTableOffset = num;
  getPatientDetailss();
}

function selectPatientDetails(id) {
  getPatientDetails(id);
  $("#findPatientDetailsModal").modal("hide");
}

function findPatientDetails() {
  $("#findPatientDetailsModal").modal("show");
  getPatientDetailss();
}

function submitCart() {
  if (cartItems.length < 1) {
    swal("Error", "Please add atleast one item", "error");
    return;
  }
  let data = {
    token: Cookies.get("token"),
    hospital_type: $("#cartHospitalType").val(),
    hospital_id: $("#cartHospitalId").val(),
    hospital_prescription_id: $("#cartPrescriptionId").val(),
    cheque_no: $("#pm_cheque_no").val(),
    bank_name: $("#pm_bank_name").val(),
    account_holder_name: $("#pm_ac_holder_name").val(),
    cheque_date: $("#pm_cheque_date").val(),
    transaction_id: $("#pm_transaction_id").val(),
    insurance_company_id: $("#pm_insurance_company_id").val(),
    patient_insurance_id: $("#pm_patient_insurance_id").val(),
    patient: {
      id: $("#cartPatientId").val(),
      hospital_id: $("#cartPatientHospitalId").val(),
      hospital_patient_id: $("#cartPatientHospitalPatientId").val(),
      first_name: $("#cartPatientFirstName").val(),
      middle_name: $("#cartPatientMiddleName").val(),
      last_name: $("#cartPatientLastName").val(),
      street_address_1: $("#cartPatientStreetAddress").val(),
      dob: $("#cartPatientDOB").val(),
      phone: $("#cartPatientPhone").val(),
      email: $("#cartPatientEmail").val(),
      city: $("#cartPatientCity").val(),
      state: $("#cartPatientState").val(),
      zip: $("#cartPatientZip").val(),
    },
    drugs: {
      ...cartItemDetails,
    },
    discount: $("#cartPaymentDiscount").val(),
    total_price: $("#cartPaymentTotalAmount").text(),
    status: $("#cartOrderStatus").val(),
    payment_type: $("#cartPaymentType").val(),
    additional_information: $("#cartPaymentAdditionalInformation").val(),
  };
  console.log(data);
  $.ajax({
    url: "/pharmacies/addorder",
    method: "POST",
    data: data,
    success: function (result) {
      console.log(result);
      checkSession(result);
      if (result.status == "success") {
        swal("Success", "Ordered made successfully", "success");
        setTimeout(() => {
          if (result.url && result.url.length) location.href = result.url;
          else location.href = location.href;
        }, 1200);
      } else {
        swal("Error", result.message, "error");
      }
    },
  });
}

function scrollToBottom() {
  var $target = $("html,body");
  $target.animate({ scrollTop: $target.height() }, 1000);
}

function paymentTypeChanged(val) {
  $(".pm").addClass("hide");
  if (val == 1) {
    $(".pm-cheque").removeClass("hide");
  } else if (val == 2) {
    $(".pm-online").removeClass("hide");
  } else if (val == 3) {
    $(".pm-insurance").removeClass("hide");
  }
}
