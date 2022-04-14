$(document).ready(function () {
  isAllowed().then((res) => {
    getPurchase_drug_items();
    getVendors();
  });
});

var Purchase_drug_itemTableOffset = 0;
var Purchase_drug_itemTableLimit = 10;
var Purchase_drug_itemTableOrderField = "id";
var Purchase_drug_itemTableOrderFieldBy = "DESC";

function updatePurchase_drug_itemsTableHeaderSort() {
  $(".sort-icon").addClass("fade-l");
  $(
    "#" +
      Purchase_drug_itemTableOrderField +
      "Sort" +
      Purchase_drug_itemTableOrderFieldBy
  ).removeClass("fade-l");
}

function getPurchase_drug_items(searchObj) {
  updatePurchase_drug_itemsTableHeaderSort();

  const data = {
    offset: Purchase_drug_itemTableOffset,
    limit: Purchase_drug_itemTableLimit,
    order: Purchase_drug_itemTableOrderField,
    order_by: Purchase_drug_itemTableOrderFieldBy,
    token: Cookies.get("token"),
  };

  if (searchObj) {
    for (key in searchObj) {
      data[key] = searchObj[key];
    }
  }

  $.ajax({
    url: "/pharmacies/getpurchase_drug_items",
    method: "POST",
    data: data,
    success: function (resultData) {
      console.log(result);
      var result = resultData.rows;
      var count = resultData.count;
      $("#purchase_drug_itemTableBody").html("");

      $("#addPurchase_drug_item").html("");
      $("#editPurchase_drug_item").html("");

      for (var i = 0; i < result.length; i++) {
        $("#purchase_drug_itemTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Purchase_drug_item')" type="checkbox" class=" checkbox-Purchase_drug_item "  data-id="${
                      result[i].id
                    }" /> </td>
					<td>${result[i] ? (result[i].id ? result[i].id : " ") : " "}</td>
						<td>${
              result[i]
                ? result[i].purchase_drug
                  ? result[i].purchase_drug.bill_id
                    ? result[i].purchase_drug.bill_id
                    : " "
                  : " "
                : " "
            }</td>
						<td>${
              result[i]
                ? result[i].purchase_drug
                  ? result[i].purchase_drug.vendor
                    ? result[i].purchase_drug.vendor.name
                      ? result[i].purchase_drug.vendor.name
                      : " "
                    : " "
                  : " "
                : " "
            }</td>
					<td>${
            result[i]
              ? result[i].purchase_drug
                ? result[i].purchase_drug.purchase_date
                  ? result[i].purchase_drug.purchase_date
                  : " "
                : " "
              : " "
          }</td>
					<td>${result[i] ? (result[i].drug_code ? result[i].drug_code : " ") : " "}</td>
					<td>${result[i] ? (result[i].quantity ? result[i].quantity : " ") : " "}</td>
					<td>${
            result[i]
              ? result[i].returned != null
                ? result[i].returned
                : " "
              : " "
          }</td><td><span class="btn btn-link btn-sm hide" onclick="editPurchase_drug_itemModal(  '${
          result[i].purchase_drug_id
        }', '${result[i].drug_code}', '${result[i].quantity}', '${
          result[i].returned
        }', ${
          result[i].id
        } )">Edit</span><span class="btn btn-link btn-sm" onclick="deletePurchase_drug_itemModal(${
          result[i].id
        })">Delete</span></td>
				          </tr>
				        `);
      }
      getPaginate(
        count,
        changePurchase_drug_itemsTableOffset,
        Purchase_drug_itemTableLimit,
        Purchase_drug_itemTableOffset,
        "Purchase_drug_item"
      );
    },
  });
}

function changePurchase_drug_itemsTableOffset(num) {
  Purchase_drug_itemTableOffset = num;
  getPurchase_drug_items();
}
function changePurchase_drug_itemsTableLimit(num) {
  Purchase_drug_itemTableLimit = num;
  getPurchase_drug_items();
}
function changePurchase_drug_itemsTableOrder(order_field, order_field_by) {
  console.log(order_field, order_field_by);

  Purchase_drug_itemTableOrderField = order_field;
  Purchase_drug_itemTableOrderFieldBy = order_field_by;
  getPurchase_drug_items();
}

var tempForm = "";
$("#searchPurchase_drug_itemForm").on("submit", (ev) => {
  ev.preventDefault();
  console.log(ev);
  tempForm = ev;
  var searchObj = {};
  $("#searchPurchase_drug_itemForm")
    .serializeArray()
    .map((i) => {
      if (i.value) searchObj[i.name] = i.value;
    });
  getPurchase_drug_items(searchObj);
});

function addPurchase_drug_item() {
  if (purchaseDrugListItem.length === 0) {
    swal("Error", "Please add atleast one item", "error");
    return;
  }
  let items = [];
  for (let i = 0; i < purchaseDrugListItem.length; i++) {
    items.push({
      drug_code: $(
        "#addPurchaseDrugItemDrugCodeInput" + purchaseDrugListItem[i]
      ).val(),
      quantity: $(
        "#addPurchaseDrugItemQuantityInput" + purchaseDrugListItem[i]
      ).val(),
      expiration_date: $(
        "#addPurchaseDrugItemExpirationDateInput" + purchaseDrugListItem[i]
      ).val(),
      selling_price: $(
        "#addPurchaseDrugItemSellingPriceInput" + purchaseDrugListItem[i]
      ).val(),
      cost_price: $(
        "#addPurchaseDrugItemCostPriceInput" + purchaseDrugListItem[i]
      ).val(),
      returned: 0,
    });
  }
  addPurchaseDrugItemWithItem(items);
}
function addPurchaseDrugItemWithItem(items) {
  $.ajax({
    url: "/pharmacies/addpurchase_drug_item",
    method: "POST",
    data: {
      bill_id: $("#addPurchaseDrugItemBillIdInput").val(),
      vendor_id: $("#addPurchaseDrugItemVendorIdInput").val(),
      purchase_date: $("#addPurchaseDrugItemPurchaseDateInput").val(),
      items,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        purchaseDrugListItem = [];
        $("#purchaseDrugItemList").html("");
        $(
          "#addPurchase_drug_itemForm input, #addPurchase_drug_itemForm textarea"
        ).val("");
        $("#addPurchase_drug_itemModal").modal("hide");
        swal({
          title: "Purchase_drug_item Added successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getPurchase_drug_items();
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

$("#addPurchase_drug_itemForm").on("submit", (ev) => {
  ev.preventDefault();
  addPurchase_drug_item();
});
var purchaseDrugListItem = [];
async function checkDrugExist(drug_code, id) {
  if (!drug_code || drug_code === "") return;
  console.log(drug_code, id);
  const data = await getDrug(drug_code);
  if (data && data.id) {
    $("#addPurchaseDrugItemNameInput" + id).val(data.drug_name);
    $("#addPurchaseDrugItemExpirationDateInput" + id).val(data.expiration_date);
    $("#addPurchaseDrugItemSellingPriceInput" + id).val(data.selling_price);
    $("#addPurchaseDrugItemCostPriceInput" + id).val(data.cost_price);
  } else {
    const result = await swal("Drug code doesn't exist! Add?", {
      buttons: { no: "No", yes: "Yes" },
    });
    $("#addPurchaseDrugItemDrugCodeInput" + id).val("");
    if (result === "yes") {
      $("#addPurchase_drug_itemModal").modal("hide");
      addDrugModal(drug_code);
    }
  }
}
function deletePurchaseDrugItem(id) {
  if (purchaseDrugListItem.length === 1 || purchaseDrugListItem.length < 2) {
    swal("Error", "Need to add atleast one item");
    return;
  }

  purchaseDrugListItem = purchaseDrugListItem.filter((item) => {
    if (item != id) return item;
  });
  $("#purchaseDrugItem" + id).remove();
}
function addPurchaseDrugListItem() {
  var id = generateRandomId(8);
  purchaseDrugListItem.push(id);
  $("#purchaseDrugItemList").append(`              
		<div class="row" id="purchaseDrugItem${id}">
		<div class="col-md-2">
		<label>Drug Code</label>
		<input
			type="text"
			id="addPurchaseDrugItemDrugCodeInput${id}"
			name="drug_code"
			class="form-control mb-2"
			placeholder="Drug Code"
			onchange="checkDrugExist(this.value,'${id}')"
		/>
		</div>
		<div class="col-md-2">
		<label>Drug Name</label>
		<input
			type="text"
			id="addPurchaseDrugItemNameInput${id}"
			name="Name"
			class="form-control mb-2"
			placeholder="Drug Name"
			readonly
		/>
		</div>
		<div class="col-md-2">
		<label>Quantity</label>
		<input
			type="number"
			id="addPurchaseDrugItemQuantityInput${id}"
			name="quantity"
			class="form-control mb-2"
			placeholder="Quantity"
		/>
		</div>
		<div class="col-md-2">
		<label>Expiration Date</label>
		<input
			type="date"
			id="addPurchaseDrugItemExpirationDateInput${id}"
			name="Expiration Date"
			class="form-control mb-2"
			placeholder="Expiration Date"
		/>
		</div>
		<div class="col-md-2">
		<label>Cost Price</label>
		<input
			type="number"
      min="0"
			id="addPurchaseDrugItemCostPriceInput${id}"
			name="Cost Price"
			class="form-control mb-2"
			placeholder="Cost Price"
		/>
		</div>
		<div class="col-md-2">
		<label>Selling Price</label>
		<input
      type="number"
      min="0"
      id="addPurchaseDrugItemSellingPriceInput${id}"
			name="Selling Price"
			class="form-control mb-2"
			placeholder="Selling Price"
		/>
		</div>
    <div class="col-md-2">
		<button class="btn btn-sm btn-danger" onclick="deletePurchaseDrugItem('${id}')" >Delete</button>
		</div>
	</div>
	`);
}
function addPurchase_drug_itemModal() {
  if (purchaseDrugListItem.length === 0) addPurchaseDrugListItem();
  $("#addPurchase_drug_itemModal").modal("show");
}

function updatePurchase_drug_item() {
  $.ajax({
    url: "/pharmacies/updatepurchase_drug_item",
    method: "POST",
    data: {
      purchase_drug_id: $("#editPurchaseDrugItemPurchaseDrugIdInput").val(),
      drug_code: $("#editPurchaseDrugItemDrugCodeInput").val(),
      quantity: $("#editPurchaseDrugItemQuantityInput").val(),
      returned: $("#editPurchaseDrugItemReturnedInput").val(),
      id: $("#editPurchaseDrugItemPurchase_drug_itemId").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        $(
          "#editPurchase_drug_itemForm input, #editPurchase_drug_itemForm textarea"
        ).val("");
        $("#editPurchase_drug_itemModal").modal("hide");
        swal({
          title: "Purchase_drug_item Updated successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getPurchase_drug_items();
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

function editPurchase_drug_itemModal(
  purchase_drug_id,
  drug_code,
  quantity,
  returned,
  id
) {
  console.log(purchase_drug_id, drug_code, quantity, returned, id);
  $("#editPurchase_drug_itemModal").modal("show");
  $("#editPurchaseDrugItemPurchaseDrugItemId").val(id);
  $("#editPurchaseDrugItemPurchaseDrugIdInput").val(purchase_drug_id);
  $("#editPurchaseDrugItemDrugCodeInput").val(drug_code);
  $("#editPurchaseDrugItemQuantityInput").val(quantity);
  $("#editPurchaseDrugItemReturnedInput").val(returned);
}
$("#editPurchase_drug_itemForm").on("submit", (ev) => {
  ev.preventDefault();
  updatePurchase_drug_item();
});

function deletePurchase_drug_item(id) {
  $.ajax({
    url: "/pharmacies/deletepurchase_drug_item",
    method: "POST",
    data: {
      id: id,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Purchase_drug_item Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getPurchase_drug_items();
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

async function deletePurchase_drug_itemModal(id) {
  const res = await swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
  console.log(res);
  if (res) {
    deletePurchase_drug_item(id);
  }
}

function bulkDeletePurchase_drug_item(ids) {
  $.ajax({
    url: "/pharmacies/bulkdeletepurchase_drug_item",
    method: "POST",
    data: {
      ids: ids,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Purchase_drug_items Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getPurchase_drug_items();
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

async function bulkDeletePurchase_drug_itemModal(ids) {
  const res = await swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
  console.log(res);
  if (res) {
    bulkDeletePurchase_drug_item(ids);
  }
}

function getVendors(searchObj) {
  const data = {
    token: Cookies.get("token"),
  };

  $.ajax({
    url: "/pharmacies/getvendors",
    method: "POST",
    data: data,
    success: function (resultData) {
      var result = resultData.rows;
      var count = resultData.count;
      $("#addPurchaseDrugItemVendorIdInput").html("");
      for (var i = 0; i < result.length; i++) {
        $("#addPurchaseDrugItemVendorIdInput").append(
          `
				<option value="${result[i].id}">${result[i].name}</option>
			`
        );
      }
    },
  });
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
function addDrug() {
  $.ajax({
    url: "/pharmacies/adddrug",
    method: "POST",
    data: {
      medication: $("#addDrugMedicationInput").val(),
      ingredient: $("#addDrugIngredientInput").val(),
      drug_code: $("#addDrugDrugCodeInput").val(),
      drug_name: $("#addDrugDrugNameInput").val(),
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

async function uploadCSV() {
  let csvFile = $("#purchaseCSVFile").get(0).files;
  if (!csvFile[0]) {
    swal("Error", "please upload csv file", "error");
    return;
  }
  let arrData = await csvToArray(csvFile[0]);
  let items = [];

  arrData.map((item) => {
    items.push({
      ...item,
      returned: 0,
    });
  });
  addPurchaseDrugItemWithItem(items);
}
