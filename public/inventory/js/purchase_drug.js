

			$(document).ready(function(){
				getPurchase_drugs();
			});

			var Purchase_drugTableOffset = 0;
			var Purchase_drugTableLimit = 10;
			var Purchase_drugTableOrderField = 'id';
			var Purchase_drugTableOrderFieldBy = 'DESC';

			function updatePurchase_drugsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+Purchase_drugTableOrderField+"Sort"+Purchase_drugTableOrderFieldBy).removeClass("fade-l");
			}

			function getPurchase_drugs(searchObj) {
				
				updatePurchase_drugsTableHeaderSort();


				  	const data = {
				    	offset: Purchase_drugTableOffset,
				    	limit : Purchase_drugTableLimit,
				    	order: Purchase_drugTableOrderField,
				    	order_by: Purchase_drugTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/pharmacies/getpurchase_drugs",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#purchase_drugTableBody").html('');

				       $("#addPurchase_drug").html("");  
				       $("#editPurchase_drug").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#purchase_drugTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Purchase_drug')" type="checkbox" class=" checkbox-Purchase_drug "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].bill_id ? result[i].bill_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].vendor_id ? result[i].vendor_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].purchase_date ? result[i].purchase_date : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editPurchase_drugModal(  '${result[i].bill_id}', '${result[i].vendor_id}', '${result[i].purchase_date}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deletePurchase_drugModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changePurchase_drugsTableOffset,Purchase_drugTableLimit,Purchase_drugTableOffset,'Purchase_drug')
				    },
				  });
				}


				function changePurchase_drugsTableOffset(num) {
					Purchase_drugTableOffset  = num;
					getPurchase_drugs();
				}
				function changePurchase_drugsTableLimit(num) {
					Purchase_drugTableLimit  = num;
					getPurchase_drugs();
				}
				function changePurchase_drugsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					Purchase_drugTableOrderField  = order_field;
					Purchase_drugTableOrderFieldBy  = order_field_by;
					getPurchase_drugs();
				}


		
				var tempForm = "";
				$("#searchPurchase_drugForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchPurchase_drugForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getPurchase_drugs(searchObj);
				})
			
				function addPurchase_drug() {
				  $.ajax({
				    url: "/pharmacies/addpurchase_drug",
				    method: "POST",
				    data: {
				    	bill_id :  $("#addPurchaseDrugBillIdInput").val() ,vendor_id :  $("#addPurchaseDrugVendorIdInput").val() ,purchase_date :  $("#addPurchaseDrugPurchaseDateInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addPurchase_drugForm input, #addPurchase_drugForm textarea").val('')
				        $("#addPurchase_drugModal").modal('hide');
				        swal({
				          title: "Purchase_drug Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPurchase_drugs();
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
			
				$("#addPurchase_drugForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addPurchase_drug();
				})
				function addPurchase_drugModal(){
				  $("#addPurchase_drugModal").modal('show');					
				}
			
				function updatePurchase_drug()  {
				  $.ajax({
				    url: "/pharmacies/updatepurchase_drug",
				    method: "POST",
				    data: {
				    	bill_id : $("#editPurchaseDrugBillIdInput").val(),vendor_id : $("#editPurchaseDrugVendorIdInput").val(),purchase_date : $("#editPurchaseDrugPurchaseDateInput").val(),id : $("#editPurchaseDrugPurchase_drugId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editPurchase_drugForm input, #editPurchase_drugForm textarea").val('')
				        $("#editPurchase_drugModal").modal('hide');
				        swal({
				          title: "Purchase_drug Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPurchase_drugs();
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
			
				function editPurchase_drugModal(bill_id,vendor_id,purchase_date,id) {
				  $("#editPurchase_drugModal").modal('show');
				  $("#editPurchaseDrugPurchase_drugId").val(id);
				  $("#editPurchaseDrugBillIdInput").val(bill_id);$("#editPurchaseDrugVendorIdInput").val(vendor_id);$("#editPurchaseDrugPurchaseDateInput").val(purchase_date);
				}
				$("#editPurchase_drugForm").on('submit',(ev) => {
					ev.preventDefault();
					updatePurchase_drug();
				})

			
				function deletePurchase_drug(id) {
				  $.ajax({
				    url: "/pharmacies/deletepurchase_drug",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Purchase_drug Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPurchase_drugs();
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
			

				async function deletePurchase_drugModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deletePurchase_drug(id);
				  }
				}
			
				function bulkDeletePurchase_drug(ids) {
				  $.ajax({
				    url: "/pharmacies/bulkdeletepurchase_drug",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Purchase_drugs Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPurchase_drugs();
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
			

				async function bulkDeletePurchase_drugModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeletePurchase_drug(ids);
				  }
				};

			