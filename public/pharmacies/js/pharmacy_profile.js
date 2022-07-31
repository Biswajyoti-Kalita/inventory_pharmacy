$(document).ready(function () {
  isAllowed().then((res) => {
    getPharmacy_profiles();
  });
});

var Pharmacy_profileTableOffset = 0;
var Pharmacy_profileTableLimit = 10;
var Pharmacy_profileTableOrderField = "id";
var Pharmacy_profileTableOrderFieldBy = "DESC";

function updatePharmacy_profilesTableHeaderSort() {
  $(".sort-icon").addClass("fade-l");
  $(
    "#" +
      Pharmacy_profileTableOrderField +
      "Sort" +
      Pharmacy_profileTableOrderFieldBy
  ).removeClass("fade-l");
}

function getPharmacy_profiles(searchObj) {
  //updatePharmacy_profilesTableHeaderSort();

  const data = {
    offset: Pharmacy_profileTableOffset,
    limit: Pharmacy_profileTableLimit,
    order: Pharmacy_profileTableOrderField,
    order_by: Pharmacy_profileTableOrderFieldBy,
    token: Cookies.get("token"),
  };

  $.ajax({
    url: "/pharmacies/getpharmacy_profile",
    method: "POST",
    data: data,
    success: function (result) {
      console.log(result);
      checkSession(result);

      if (result) {
        $("#viewPharmacy_profileNameInput").text(result.name);
        $("#viewPharmacy_profileRegnNoInput").text(result.regn_no);
        $("#viewPharmacy_profileAddress1Input").text(result.address_1);
        $("#viewPharmacy_profileAddress2Input").text(result.address_2);
        $("#viewPharmacy_profileCityInput").text(result.city);
        $("#viewPharmacy_profileStateInput").text(result.state);
        $("#viewPharmacy_profileZipInput").text(result.zip);
        $("#viewPharmacy_profileEmailInput").text(result.email);
        $("#viewPharmacy_profilePhoneInput").text(result.phone);
        $("#viewPharmacy_profileOwnerNameInput").text(result.owner_name);
        $("#viewPharmacy_profileOwnerContactInput").text(result.owner_contact);
        $("#viewPharmacy_profileOwnerEmailInput").text(result.owner_email);
        $("#viewPharmacy_profileStripeIDInput").text(
          result.stripe_id ? result.stripe_id : ""
        );

        if (isSuperUser)
          $("#updateBtnDiv").html(`
          <button class="btn btn-primary" onclick="editPharmacyProfileModal('${
            result.regn_no
          }','${result.address_1}','${result.address_2}','${result.city}','${
            result.state
          }','${result.zip}','${result.email}','${result.phone}', '${
            result.stripe_id ? result.stripe_id : ""
          }','${result.id}')" >Edit</button>
        `);
      } else {
        $("#updateBtnDiv").html("");
      }
    },
  });
}

function changePharmacy_profilesTableOffset(num) {
  Pharmacy_profileTableOffset = num;
  getPharmacy_profiles();
}
function changePharmacy_profilesTableLimit(num) {
  Pharmacy_profileTableLimit = num;
  getPharmacy_profiles();
}
function changePharmacy_profilesTableOrder(order_field, order_field_by) {
  console.log(order_field, order_field_by);

  Pharmacy_profileTableOrderField = order_field;
  Pharmacy_profileTableOrderFieldBy = order_field_by;
  getPharmacy_profiles();
}

function updatePharmacy_profile() {
  $.ajax({
    url: "/pharmacies/updatepharmacy_profile",
    method: "POST",
    data: {
      regn_no: $("#editPharmacyProfileRegnNoInput").val(),
      address_1: $("#editPharmacyProfileAddress1Input").val(),
      address_2: $("#editPharmacyProfileAddress2Input").val(),
      city: $("#editPharmacyProfileCityInput").val(),
      state: $("#editPharmacyProfileStateInput").val(),
      zip: $("#editPharmacyProfileZipInput").val(),
      email: $("#editPharmacyProfileEmailInput").val(),
      phone: $("#editPharmacyProfilePhoneInput").val(),
      stripe_id: $("#editPharmacyProfileStripeIDInput").val(),
      id: $("#editPharmacyProfilePharmacy_profileId").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      checkSession(result);
      if (result.status == "success") {
        $(
          "#editPharmacyProfileForm input, #editPharmacyProfileForm textarea"
        ).val("");
        $("#editPharmacyProfileModal").modal("hide");
        swal({
          title: "Pharmacy_profile Updated successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getPharmacy_profiles();
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

function editPharmacyProfileModal(
  regn_no,
  address_1,
  address_2,
  city,
  state,
  zip,
  email,
  phone,
  stripe_id,
  id
) {
  $("#editPharmacyProfileModal").modal("show");
  $("#editPharmacyProfilePharmacy_profileId").val(id);
  $("#editPharmacyProfileRegnNoInput").val(regn_no);
  $("#editPharmacyProfileAddress1Input").val(address_1);
  $("#editPharmacyProfileAddress2Input").val(address_2);
  $("#editPharmacyProfileCityInput").val(city);
  $("#editPharmacyProfileStateInput").val(state);
  $("#editPharmacyProfileZipInput").val(zip);
  $("#editPharmacyProfileEmailInput").val(email);
  $("#editPharmacyProfilePhoneInput").val(phone);
  $("#editPharmacyProfileStripeIDInput").val(stripe_id);
}
$("#editPharmacyProfileForm").on("submit", (ev) => {
  ev.preventDefault();
  updatePharmacy_profile();
});
