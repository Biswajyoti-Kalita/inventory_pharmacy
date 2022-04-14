

			$(document).ready(function(){
				getPurchase_return_drugs();
			});

			var Purchase_return_drugTableOffset = 0;
			var Purchase_return_drugTableLimit = 10;
			var Purchase_return_drugTableOrderField = 'id';
			var Purchase_return_drugTableOrderFieldBy = 'DESC';

			function updatePurchase_return_drugsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+Purchase_return_drugTableOrderField+"Sort"+Purchase_return_drugTableOrderFieldBy).removeClass("fade-l");
			}

			function getPurchase_return_drugs(searchObj) {
				
				updatePurchase_return_drugsTableHeaderSort();


				  	const data = {
				    	offset: Purchase_return_drugTableOffset,
				    	limit : Purchase_return_drugTableLimit,
				    	order: Purchase_return_drugTableOrderField,
				    	order_by: Purchase_return_drugTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getpurchase_return_drugs",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#purchase_return_drugTableBody").html('');

				       $("#addPurchase_return_drug").html("");  
				       $("#editPurchase_return_drug").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#purchase_return_drugTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Purchase_return_drug')" type="checkbox" class=" checkbox-Purchase_return_drug "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].purchase_drug_item_id ? result[i].purchase_drug_item_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].quantity ? result[i].quantity : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].return_date ? result[i].return_date : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editPurchase_return_drugModal(  '${result[i].purchase_drug_item_id}', '${result[i].quantity}', '${result[i].return_date}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deletePurchase_return_drugModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changePurchase_return_drugsTableOffset,Purchase_return_drugTableLimit,Purchase_return_drugTableOffset,'Purchase_return_drug')
				    },
				  });
				}


				function changePurchase_return_drugsTableOffset(num) {
					Purchase_return_drugTableOffset  = num;
					getPurchase_return_drugs();
				}
				function changePurchase_return_drugsTableLimit(num) {
					Purchase_return_drugTableLimit  = num;
					getPurchase_return_drugs();
				}
				function changePurchase_return_drugsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					Purchase_return_drugTableOrderField  = order_field;
					Purchase_return_drugTableOrderFieldBy  = order_field_by;
					getPurchase_return_drugs();
				}


		
				var tempForm = "";
				$("#searchPurchase_return_drugForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchPurchase_return_drugForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getPurchase_return_drugs(searchObj);
				})
			
				function addPurchase_return_drug() {
				  $.ajax({
				    url: "/admin/addpurchase_return_drug",
				    method: "POST",
				    data: {
				    	purchase_drug_item_id :  $("#addPurchaseReturnDrugPurchaseDrugItemIdInput").val() ,quantity :  $("#addPurchaseReturnDrugQuantityInput").val() ,return_date :  $("#addPurchaseReturnDrugReturnDateInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addPurchase_return_drugForm input, #addPurchase_return_drugForm textarea").val('')
				        $("#addPurchase_return_drugModal").modal('hide');
				        swal({
				          title: "Purchase_return_drug Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPurchase_return_drugs();
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
			
				$("#addPurchase_return_drugForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addPurchase_return_drug();
				})
				function addPurchase_return_drugModal(){
				  $("#addPurchase_return_drugModal").modal('show');					
				}
			
				function updatePurchase_return_drug()  {
				  $.ajax({
				    url: "/admin/updatepurchase_return_drug",
				    method: "POST",
				    data: {
				    	purchase_drug_item_id : $("#editPurchaseReturnDrugPurchaseDrugItemIdInput").val(),quantity : $("#editPurchaseReturnDrugQuantityInput").val(),return_date : $("#editPurchaseReturnDrugReturnDateInput").val(),id : $("#editPurchaseReturnDrugPurchase_return_drugId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editPurchase_return_drugForm input, #editPurchase_return_drugForm textarea").val('')
				        $("#editPurchase_return_drugModal").modal('hide');
				        swal({
				          title: "Purchase_return_drug Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPurchase_return_drugs();
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
			
				function editPurchase_return_drugModal(purchase_drug_item_id,quantity,return_date,id) {
				  $("#editPurchase_return_drugModal").modal('show');
				  $("#editPurchaseReturnDrugPurchase_return_drugId").val(id);
				  $("#editPurchaseReturnDrugPurchaseDrugItemIdInput").val(purchase_drug_item_id);$("#editPurchaseReturnDrugQuantityInput").val(quantity);$("#editPurchaseReturnDrugReturnDateInput").val(return_date);
				}
				$("#editPurchase_return_drugForm").on('submit',(ev) => {
					ev.preventDefault();
					updatePurchase_return_drug();
				})

			
				function deletePurchase_return_drug(id) {
				  $.ajax({
				    url: "/admin/deletepurchase_return_drug",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Purchase_return_drug Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPurchase_return_drugs();
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
			

				async function deletePurchase_return_drugModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deletePurchase_return_drug(id);
				  }
				}
			
				function bulkDeletePurchase_return_drug(ids) {
				  $.ajax({
				    url: "/admin/bulkdeletepurchase_return_drug",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Purchase_return_drugs Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPurchase_return_drugs();
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
			

				async function bulkDeletePurchase_return_drugModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeletePurchase_return_drug(ids);
				  }
				};

			