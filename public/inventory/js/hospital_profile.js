$(document).ready(function () {
  isAllowed().then((res) => {
    getHospitalprofile();
  });
});

function getHospitalprofile(searchObj) {
  //updatehospital_profilesTableHeaderSort();

  const data = {
    token: Cookies.get("token"),
  };

  $.ajax({
    url: "/pharmacies/gethospital_profile",
    method: "POST",
    data: data,
    success: function (result) {
      console.log(result);

      if (result.data && result.data.name) {
        $("#viewhospital_profileNameInput").text(result.data.name);
        $("#viewhospital_profileStreetAddressInput").text(
          result.data.street_address
        );
        $("#viewhospital_profileCityInput").text(result.data.city);
        $("#viewhospital_profileZipInput").text(result.data.zip);
        $("#viewhospital_profileStateInput").text(result.data.state);
      } else {
        $("#updateBtnDiv").html("");
      }
    },
  });
}

function changehospital_profilesTableOffset(num) {
  hospital_profileTableOffset = num;
  gethospital_profiles();
}
function changehospital_profilesTableLimit(num) {
  hospital_profileTableLimit = num;
  gethospital_profiles();
}
function changehospital_profilesTableOrder(order_field, order_field_by) {
  console.log(order_field, order_field_by);

  hospital_profileTableOrderField = order_field;
  hospital_profileTableOrderFieldBy = order_field_by;
  gethospital_profiles();
}
