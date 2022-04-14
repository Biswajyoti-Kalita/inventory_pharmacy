$(document).ready(function () {
  isAllowed().then((res) => {
    getCategories();
    getDrugs();
  });
});

var DrugTableOffset = 0;
var DrugTableLimit = 10;
var DrugTableOrderField = "id";
var DrugTableOrderFieldBy = "DESC";

function updateDrugsTableHeaderSort() {
  $(".sort-icon").addClass("fade-l");
  $("#" + DrugTableOrderField + "Sort" + DrugTableOrderFieldBy).removeClass(
    "fade-l"
  );
}
async function getCategories() {
  const data = await fetch("/pharmacies/get_all_categories", {
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
  $("#addDrugCategoryInput, #editDrugCategoryInput, #filter_categories").html(
    ""
  );
  $("#filter_categories").html(`<option value="" >All</option>`);
  if (data) {
    data?.map((item) => {
      $(
        "#addDrugCategoryInput ,#editDrugCategoryInput, #filter_categories"
      ).append(`<option value="${item.id}" >${item.name}</option>`);
    });
  }
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
  return data;
}

function getDrugs(searchObj) {
  updateDrugsTableHeaderSort();

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
      var result = resultData.rows;
      var count = resultData.count;
      $("#drugTableBody").html("");

      $("#addDrug").html("");
      $("#editDrug").html("");

      for (var i = 0; i < result.length; i++) {
        $("#drugTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Drug')" type="checkbox" class=" checkbox-Drug "  data-id="${
                      result[i].id
                    }" /> </td>
					<td>${result[i] ? (result[i].id ? result[i].id : " ") : " "}</td>
					<td>${
            result[i]
              ? result[i].category
                ? result[i].category.name
                : " "
              : " "
          }</td>
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
					<td>${result[i] ? (result[i].drug_code ? result[i].drug_code : " ") : " "}</td>
					<td>${result[i] ? (result[i].drug_name ? result[i].drug_name : " ") : " "}</td>
					<td>${result[i] ? (result[i].brand ? result[i].brand : " ") : " "}</td>
					<td>${
            result[i]
              ? result[i].available_quantity
                ? result[i].available_quantity
                : " "
              : " "
          }</td>
					<td>${result[i] ? (result[i].batch_no ? result[i].batch_no : " ") : " "}</td>
					<td>${
            result[i]
              ? result[i].reorder_quantity
                ? result[i].reorder_quantity
                : " "
              : " "
          }</td>
					<td>${
            result[i]
              ? result[i].expiration_date
                ? result[i].expiration_date
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
              ? result[i].cost_price
                ? result[i].cost_price
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
					<td>${
            result[i]
              ? result[i].description
                ? result[i].description
                : " "
              : " "
          }</td>
          
          
          <td><span class="btn btn-link btn-sm" onclick="editDrugModal( '${
            result[i].category_id
          }',   '${result[i].medication}', '${result[i].ingredient}', '${
          result[i].drug_code
        }', '${result[i].drug_name}', '${
          result[i].brand ? result[i].brand : ""
        }', '${result[i].available_quantity}', '${result[i].batch_no}', '${
          result[i].reorder_quantity
        }', '${result[i].expiration_date}', '${
          result[i].semantic_brand_name
        }', '${result[i].cost_price}', '${result[i].selling_price}', '${
          result[i].description ? result[i].description : ""
        }',  ${
          result[i].id
        } )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteDrugModal(${
          result[i].id
        })">Delete</span></td>
				          </tr>
				        `);
      }
      getPaginate(
        count,
        changeDrugsTableOffset,
        DrugTableLimit,
        DrugTableOffset,
        "Drug"
      );
    },
  });
}

function changeDrugsTableOffset(num) {
  DrugTableOffset = num;
  getDrugs();
}
function changeDrugsTableLimit(num) {
  DrugTableLimit = num;
  getDrugs();
}
function changeDrugsTableOrder(order_field, order_field_by) {
  console.log(order_field, order_field_by);

  DrugTableOrderField = order_field;
  DrugTableOrderFieldBy = order_field_by;
  getDrugs();
}

var tempForm = "";
$("#searchDrugForm").on("submit", (ev) => {
  ev.preventDefault();
  console.log(ev);
  tempForm = ev;
  var searchObj = {};
  $("#searchDrugForm")
    .serializeArray()
    .map((i) => {
      if (i.value) searchObj[i.name] = i.value;
    });
  getDrugs(searchObj);
});

function addDrug() {
  let category_id = parseInt($("#addDrugCategoryInput").val());
  $.ajax({
    url: "/pharmacies/adddrug",
    method: "POST",
    data: {
      medication: $("#addDrugMedicationInput").val(),
      ingredient: $("#addDrugIngredientInput").val(),
      drug_code: $("#addDrugDrugCodeInput").val(),
      drug_name: $("#addDrugDrugNameInput").val(),
      brand: $("#addDrugBrandInput").val(),
      category_id: category_id,
      description: $("#addDrugDescriptionInput").val(),
      available_quantity: $("#addDrugAvailableQuantityInput").val(),
      batch_no: $("#addDrugBatchNoInput").val(),
      reorder_quantity: $("#addDrugReorderQuantityInput").val(),
      expiration_date: $("#addDrugExpirationDateInput").val(),
      semantic_brand_name: $("#addDrugSemanticBrandNameInput").val(),
      cost_price: $("#addDrugCostPriceInput").val(),
      selling_price: $("#addDrugSellingPriceInput").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        $("#addDrugForm input, #addDrugForm textarea").val("");
        $("#addDrugModal").modal("hide");
        swal({
          title: "Drug Added successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getDrugs();
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

$("#addDrugForm").on("submit", (ev) => {
  ev.preventDefault();
  addDrug();
});
function addDrugModal(drug_code) {
  $("#addDrugModal").modal("show");
  if (drug_code) {
    $("#addDrugDrugCodeInput").val(drug_code);
  }
}
function importDrug() {
  $("#importDrugModal").modal("show");
}
function updateDrug() {
  $.ajax({
    url: "/pharmacies/updatedrug",
    method: "POST",
    data: {
      medication: $("#editDrugMedicationInput").val(),
      ingredient: $("#editDrugIngredientInput").val(),
      drug_code: $("#editDrugDrugCodeInput").val(),
      drug_name: $("#editDrugDrugNameInput").val(),
      brand: $("#editDrugBrandInput").val(),
      category_id: $("#editDrugCategoryInput").val(),
      description: $("#editDrugDescriptionInput").val(),
      available_quantity: $("#editDrugAvailableQuantityInput").val(),
      batch_no: $("#editDrugBatchNoInput").val(),
      reorder_quantity: $("#editDrugReorderQuantityInput").val(),
      expiration_date: $("#editDrugExpirationDateInput").val(),
      semantic_brand_name: $("#editDrugSemanticBrandNameInput").val(),
      cost_price: $("#editDrugCostPriceInput").val(),
      selling_price: $("#editDrugSellingPriceInput").val(),
      id: $("#editDrugDrugId").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        $("#editDrugForm input, #editDrugForm textarea").val("");
        $("#editDrugModal").modal("hide");
        swal({
          title: "Drug Updated successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getDrugs();
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

function editDrugModal(
  category_id,
  medication,
  ingredient,
  drug_code,
  drug_name,
  brand,
  available_quantity,
  batch_no,
  reorder_quantity,
  expiration_date,
  semantic_brand_name,
  cost_price,
  selling_price,
  description,
  id
) {
  console.log("REAC");
  if (category_id == 1) {
    $(".edit_product_form").addClass("hide");
    $(".edit_drug_form").removeClass("hide");
  } else {
    $(".edit_product_form").removeClass("hide");
    $(".edit_drug_form").addClass("hide");
  }

  $("#editDrugModal").modal("show");
  $("#editDrugDrugId").val(id);
  $("#editDrugCategoryInput").val(category_id);
  $("#editDrugBrandInput").val(brand);
  $("#editDrugDescriptionInput").val(description);

  $("#editDrugMedicationInput").val(medication);
  $("#editDrugIngredientInput").val(ingredient);
  $("#editDrugDrugCodeInput").val(drug_code);
  $("#editDrugDrugNameInput").val(drug_name);
  $("#editDrugAvailableQuantityInput").val(available_quantity);
  $("#editDrugBatchNoInput").val(batch_no);
  $("#editDrugReorderQuantityInput").val(reorder_quantity);
  $("#editDrugExpirationDateInput").val(expiration_date);
  $("#editDrugSemanticBrandNameInput").val(semantic_brand_name);
  $("#editDrugCostPriceInput").val(cost_price);
  $("#editDrugSellingPriceInput").val(selling_price);
}
$("#editDrugForm").on("submit", (ev) => {
  ev.preventDefault();
  updateDrug();
});

function deleteDrug(id) {
  $.ajax({
    url: "/pharmacies/deletedrug",
    method: "POST",
    data: {
      id: id,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Drug Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getDrugs();
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

async function deleteDrugModal(id) {
  const res = await swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
  console.log(res);
  if (res) {
    deleteDrug(id);
  }
}

function bulkDeleteDrug(ids) {
  $.ajax({
    url: "/pharmacies/bulkdeletedrug",
    method: "POST",
    data: {
      ids: ids,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Drugs Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getDrugs();
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

async function bulkDeleteDrugModal(ids) {
  const res = await swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
  console.log(res);
  if (res) {
    bulkDeleteDrug(ids);
  }
}

$("#importDrug").on("submit", async (ev) => {
  ev.preventDefault();
  let csvFile = $("#drugCSVFile").get(0).files;
  if (!csvFile[0]) {
    swal("Error", "please upload csv file", "error");
    return;
  }
  const arrData = await csvToArray(csvFile[0]);
  console.log(arrData);
  $.ajax({
    url: "/pharmacies/importdrug",
    method: "POST",
    data: {
      data: arrData,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Drug Imported successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getDrugs();
      } else
        swal({
          title: "Unsuccessfully",
          text: result.message,
          icon: "error",
          button: "Okay",
        });
    },
  });
});

function updateAddDrugForm(val) {
  var r = document.getElementById("addDrugCategoryInput");
  var selectedValue = r.children[r.selectedIndex].innerText.toLowerCase();

  if (selectedValue == "drug" || selectedValue == "drugs") {
    $(".drug_form").removeClass("hide");
    $(".product_form").addClass("hide");
  } else {
    $(".drug_form").addClass("hide");
    $(".product_form").removeClass("hide");
  }
}

function updateEditDrugForm(val) {
  var r = document.getElementById("editDrugCategoryInput");
  var selectedValue = r.children[r.selectedIndex].innerText.toLowerCase();

  if (selectedValue == "drug" || selectedValue == "drugs") {
    $(".edit_drug_form").removeClass("hide");
    $(".edit_product_form").addClass("hide");
  } else {
    $(".edit_drug_form").addClass("hide");
    $(".edit_product_form").removeClass("hide");
  }
}
