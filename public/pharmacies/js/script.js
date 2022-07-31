let hostName = location.hostname.replace(".jajirx.com", "");
let isSuperUser = false;
if (hostName === "inventory") {
  document.title = document.title.replace("Pharmacies", "");
  $(".user-panel .d-block").text(capitalizeFirstLetter(hostName));
  $(".user-panel .d-block").attr("href", "home.html");
}

function logout() {
  Cookies.remove("token");
  location.href = "/pharmacies/index.html";
}
let menus = {
  home: {
    link: "home",
    name: "Home",
    icon: "fas fa-home fa-fw",
  },
  category: {
    link: "category",
    name: "Inventory Category",
    icon: "fas fa-layer-group fa-fw",
  },
  cart: {
    link: "cart",
    name: "Cart",
    icon: "fas fa-cart-plus fa-fw",
  },
  purchase: {
    link: "purchase_drug_item",
    name: "Purchase",
    icon: "fas fa-cash-register fa-fw",
  },
  vendor: {
    link: "vendor",
    name: "Vendor",
    icon: "fas fa-user-friends fa-fw",
  },
  inventory: {
    link: "drug",
    name: "Inventory",
    icon: "fas fa-boxes fa-fw",
  },
  patient_order: {
    link: "patient_order",
    name: "Patient Order",
    icon: "fas fa-hospital-user fa-fw",
  },
  hospital_order: {
    link: "hospital_order",
    name: "Hospital Order",
    icon: "far fa-hospital fa-fw",
  },
  users: {
    link: "user",
    name: "Users",
    icon: "fas fa-users fa-fw",
  },
  insurance_company: {
    link: "insurance_company",
    name: "Insurance",
    icon: "fas fa-industry fa-fw",
  },
  pharmacy_profile: {
    link: "pharmacy_profile",
    name: "Pharmacy Profile",
    icon: "fas fa-address-card fa-fw",
  },
  change_password: {
    link: "change_password",
    name: "Change Password",
    icon: "fas fa-key fa-fw",
  },
};

function decodePermissions(val) {
  if (val == 1) return "inventory,vendor,purchase,category";
  else if (val == 2) return "insurance_company,patient_order,cart";
  else if (val == 3)
    return "inventory,vendor,purchase,category,insurance_company,patient_order,cart";
  else if (val == 4) return "hospital_order,inventory,vendor,purchase,category";
  else return "";
}

function checkSession(data) {
  if (data && data.status == "error" && data.msg?.name == "TokenExpiredError") {
    console.log("check session expired ", data);
    Cookies.remove("token");
    setTimeout(() => {
      window.location.href = "index.html?message=token+expired";
    }, 300);
  } else if (data && data.msg == "please send the token") {
    console.log("check session expired ", data);
    setTimeout(() => {
      window.location.href = "index.html?message=token+expired";
    }, 300);
  }
  return;
}

async function isAllowed() {
  console.log("inside is allowed ");
  const data = await fetch("/pharmacies/get_user_permissions", {
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

  checkSession(data);
  try {
    let currentPage = document.title
      .replace("Pharmacies", "")
      .replace("Inventory", "")
      .trim()
      .toLowerCase();
    let permissions = [];
    console.log(
      "current page ",
      currentPage,
      " permissions ",
      data.permissions
    );
    if (data.is_owner) {
      permissions.push("users");
      isSuperUser = true;
    }
    permissions.push("pharmacy_profile");
    permissions.push("change_password");

    let dataPermissions = decodePermissions(data.permissions);
    if (dataPermissions) {
      dataPermissions.split(",")?.map((item) => {
        if (item) permissions.push(item);
      });
    }
    console.log("total permissions ", permissions.toString());
    if (permissions[0]) {
      if (permissions.indexOf(currentPage) < 0 && currentPage != "home") {
        showError();
      } else {
        createMenus(permissions);
        return {
          status: "true",
          permissions: dataPermissions,
        };
      }
    } else {
      if (currentPage != "home") redirectToHomePage();
      return false;
    }
  } catch (err) {
    return false;
  }

  createMenus(data.permissions.split(","));
  return {
    status: "true",
    permissions: data.permissions,
  };
}
function showError() {
  document.write(
    "<!DOCTYPE html><body><center><h4>you are not allowed to access this page</h4></center></body>"
  );
}

function redirectToHomePage(permissions) {
  location.href = "/pharmacies/home.html";
}

function createMenus(permissions) {
  permissions.push("home");
  var q = document.querySelector(".nav-sidebar");
  q.innerHTML = "";
  let innerHTML = "";

  let currentPage = document.title
    .replace("Pharmacies", "")
    .replace("Inventory", "")
    .trim()
    .toLowerCase();

  for (let item in menus) {
    if (permissions.indexOf(item) >= 0) {
      innerHTML += `
            <li class="nav-item">
                <a href="${menus[item].link}.html" class="nav-link ${
        currentPage == item ? "active" : ""
      }">
                    <i class="nav-icon ${
                      menus[item].icon ? menus[item].icon : "fas fa-user"
                    }"></i>
                    <p>${menus[item].name}</p>
                </a>
            </li>
        `;
    }
  }
  q.innerHTML = innerHTML;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
