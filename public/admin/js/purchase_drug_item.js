

			$(document).ready(function(){
				getPurchase_drug_items();
			});

			var Purchase_drug_itemTableOffset = 0;
			var Purchase_drug_itemTableLimit = 10;
			var Purchase_drug_itemTableOrderField = 'id';
			var Purchase_drug_itemTableOrderFieldBy = 'DESC';

			function updatePurchase_drug_itemsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+Purchase_drug_itemTableOrderField+"Sort"+Purchase_drug_itemTableOrderFieldBy).removeClass("fade-l");
			}

			function getPurchase_drug_items(searchObj) {
				
				updatePurchase_drug_itemsTableHeaderSort();


				  	const data = {
				    	offset: Purchase_drug_itemTableOffset,
				    	limit : Purchase_drug_itemTableLimit,
				    	order: Purchase_drug_itemTableOrderField,
				    	order_by: Purchase_drug_itemTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getpurchase_drug_items",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#purchase_drug_itemTableBody").html('');

				       $("#addPurchase_drug_item").html("");  
				       $("#editPurchase_drug_item").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#purchase_drug_itemTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Purchase_drug_item')" type="checkbox" class=" checkbox-Purchase_drug_item "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].purchase_drug_id ? result[i].purchase_drug_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].drug_code ? result[i].drug_code : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].quantity ? result[i].quantity : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].returned ? result[i].returned : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editPurchase_drug_itemModal(  '${result[i].purchase_drug_id}', '${result[i].drug_code}', '${result[i].quantity}', '${result[i].returned}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deletePurchase_drug_itemModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changePurchase_drug_itemsTableOffset,Purchase_drug_itemTableLimit,Purchase_drug_itemTableOffset,'Purchase_drug_item')
				    },
				  });
				}


				function changePurchase_drug_itemsTableOffset(num) {
					Purchase_drug_itemTableOffset  = num;
					getPurchase_drug_items();
				}
				function changePurchase_drug_itemsTableLimit(num) {
					Purchase_drug_itemTableLimit  = num;
					getPurchase_drug_items();
				}
				function changePurchase_drug_itemsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					Purchase_drug_itemTableOrderField  = order_field;
					Purchase_drug_itemTableOrderFieldBy  = order_field_by;
					getPurchase_drug_items();
				}


		
				var tempForm = "";
				$("#searchPurchase_drug_itemForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchPurchase_drug_itemForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getPurchase_drug_items(searchObj);
				})
			
				function addPurchase_drug_item() {
				  $.ajax({
				    url: "/admin/addpurchase_drug_item",
				    method: "POST",
				    data: {
				    	purchase_drug_id :  $("#addPurchaseDrugItemPurchaseDrugIdInput").val() ,drug_code :  $("#addPurchaseDrugItemDrugCodeInput").val() ,quantity :  $("#addPurchaseDrugItemQuantityInput").val() ,returned :  $("#addPurchaseDrugItemReturnedInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addPurchase_drug_itemForm input, #addPurchase_drug_itemForm textarea").val('')
				        $("#addPurchase_drug_itemModal").modal('hide');
				        swal({
				          title: "Purchase_drug_item Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPurchase_drug_items();
				      }
				      else 
				        swal({
				          title: "Unsuccessfully",
				          text: result.message,
				          icon: "error",
				          button: "Okay",
				        });
				    },
				  });
				}
			
				$("#addPurchase_drug_itemForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addPurchase_drug_item();
				})
				function addPurchase_drug_itemModal(){
				  $("#addPurchase_drug_itemModal").modal('show');					
				}
			
				function updatePurchase_drug_item()  {
				  $.ajax({
				    url: "/admin/updatepurchase_drug_item",
				    method: "POST",
				    data: {
				    	purchase_drug_id : $("#editPurchaseDrugItemPurchaseDrugIdInput").val(),drug_code : $("#editPurchaseDrugItemDrugCodeInput").val(),quantity : $("#editPurchaseDrugItemQuantityInput").val(),returned : $("#editPurchaseDrugItemReturnedInput").val(),id : $("#editPurchaseDrugItemPurchase_drug_itemId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editPurchase_drug_itemForm input, #editPurchase_drug_itemForm textarea").val('')
				        $("#editPurchase_drug_itemModal").modal('hide');
				        swal({
				          title: "Purchase_drug_item Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPurchase_drug_items();
				      }
				      else 
				        swal({
				          title: "Unsuccessfully",
				          text: result.message,
				          icon: "error",
				          button: "Okay",
				        });

				    },
				  });
				}
			
				function editPurchase_drug_itemModal(purchase_drug_id,drug_code,quantity,returned,id) {
				  $("#editPurchase_drug_itemModal").modal('show');
				  $("#editPurchaseDrugItemPurchase_drug_itemId").val(id);
				  $("#editPurchaseDrugItemPurchaseDrugIdInput").val(purchase_drug_id);$("#editPurchaseDrugItemDrugCodeInput").val(drug_code);$("#editPurchaseDrugItemQuantityInput").val(quantity);$("#editPurchaseDrugItemReturnedInput").val(returned);
				}
				$("#editPurchase_drug_itemForm").on('submit',(ev) => {
					ev.preventDefault();
					updatePurchase_drug_item();
				})

			
				function deletePurchase_drug_item(id) {
				  $.ajax({
				    url: "/admin/deletepurchase_drug_item",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Purchase_drug_item Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPurchase_drug_items();
				      }
				      else 
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
				  if(res){
				    deletePurchase_drug_item(id);
				  }
				}
			
				function bulkDeletePurchase_drug_item(ids) {
				  $.ajax({
				    url: "/admin/bulkdeletepurchase_drug_item",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Purchase_drug_items Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPurchase_drug_items();
				      }
				      else 
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
				  if(res){
				    bulkDeletePurchase_drug_item(ids);
				  }
				};

			