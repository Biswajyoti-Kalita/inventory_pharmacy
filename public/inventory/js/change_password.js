$(document).ready(function () {
  isAllowed();
});

function changePassword() {
  $.ajax({
    url: "/pharmacies/change_password",
    method: "POST",
    data: {
      password: $("#newPassword1").val(),
      confirm_password: $("#newPassword2").val(),
      token: Cookies.get("token"),
    },
    success: function (resultData) {
      checkSession(resultData);
      alert(resultData.message);
    },
  });
}

$("#change_password").on("submit", (ev) => {
  ev.preventDefault();
  console.log("form submit ");
  changePassword();
});
