

			$(document).ready(function(){
				getOrders();
			});

			var OrderTableOffset = 0;
			var OrderTableLimit = 10;
			var OrderTableOrderField = 'id';
			var OrderTableOrderFieldBy = 'DESC';

			function updateOrdersTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+OrderTableOrderField+"Sort"+OrderTableOrderFieldBy).removeClass("fade-l");
			}

			function getOrders(searchObj) {
				
				updateOrdersTableHeaderSort();


				  	const data = {
				    	offset: OrderTableOffset,
				    	limit : OrderTableLimit,
				    	order: OrderTableOrderField,
				    	order_by: OrderTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getorders",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#orderTableBody").html('');

				       $("#addOrder").html("");  
				       $("#editOrder").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#orderTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Order')" type="checkbox" class=" checkbox-Order "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].uuid ? result[i].uuid : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].has_prescription ? result[i].has_prescription : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_id ? result[i].hospital_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_prescription_id ? result[i].hospital_prescription_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_patient_id ? result[i].hospital_patient_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].patient_details_id ? result[i].patient_details_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].discount ? result[i].discount : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].status ? result[i].status : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].order_date ? result[i].order_date : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editOrderModal(  '${result[i].uuid}', '${result[i].has_prescription}', '${result[i].hospital_id}', '${result[i].hospital_prescription_id}', '${result[i].hospital_patient_id}', '${result[i].patient_details_id}', '${result[i].discount}', '${result[i].status}', '${result[i].order_date}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteOrderModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeOrdersTableOffset,OrderTableLimit,OrderTableOffset,'Order')
				    },
				  });
				}


				function changeOrdersTableOffset(num) {
					OrderTableOffset  = num;
					getOrders();
				}
				function changeOrdersTableLimit(num) {
					OrderTableLimit  = num;
					getOrders();
				}
				function changeOrdersTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					OrderTableOrderField  = order_field;
					OrderTableOrderFieldBy  = order_field_by;
					getOrders();
				}


		
				var tempForm = "";
				$("#searchOrderForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchOrderForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getOrders(searchObj);
				})
			
				function addOrder() {
				  $.ajax({
				    url: "/admin/addorder",
				    method: "POST",
				    data: {
				    	uuid :  $("#addOrderUuidInput").val() ,has_prescription :  $("#addOrderHasPrescriptionInput").val() ,hospital_id :  $("#addOrderHospitalIdInput").val() ,hospital_prescription_id :  $("#addOrderHospitalPrescriptionIdInput").val() ,hospital_patient_id :  $("#addOrderHospitalPatientIdInput").val() ,patient_details_id :  $("#addOrderPatientDetailsIdInput").val() ,discount :  $("#addOrderDiscountInput").val() ,status :  $("#addOrderStatusInput").val() ,order_date :  $("#addOrderOrderDateInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addOrderForm input, #addOrderForm textarea").val('')
				        $("#addOrderModal").modal('hide');
				        swal({
				          title: "Order Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrders();
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
			
				$("#addOrderForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addOrder();
				})
				function addOrderModal(){
				  $("#addOrderModal").modal('show');					
				}
			
				function updateOrder()  {
				  $.ajax({
				    url: "/admin/updateorder",
				    method: "POST",
				    data: {
				    	uuid : $("#editOrderUuidInput").val(),has_prescription : $("#editOrderHasPrescriptionInput").val(),hospital_id : $("#editOrderHospitalIdInput").val(),hospital_prescription_id : $("#editOrderHospitalPrescriptionIdInput").val(),hospital_patient_id : $("#editOrderHospitalPatientIdInput").val(),patient_details_id : $("#editOrderPatientDetailsIdInput").val(),discount : $("#editOrderDiscountInput").val(),status : $("#editOrderStatusInput").val(),order_date : $("#editOrderOrderDateInput").val(),id : $("#editOrderOrderId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editOrderForm input, #editOrderForm textarea").val('')
				        $("#editOrderModal").modal('hide');
				        swal({
				          title: "Order Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrders();
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
			
				function editOrderModal(uuid,has_prescription,hospital_id,hospital_prescription_id,hospital_patient_id,patient_details_id,discount,status,order_date,id) {
				  $("#editOrderModal").modal('show');
				  $("#editOrderOrderId").val(id);
				  $("#editOrderUuidInput").val(uuid);$("#editOrderHasPrescriptionInput").val(has_prescription);$("#editOrderHospitalIdInput").val(hospital_id);$("#editOrderHospitalPrescriptionIdInput").val(hospital_prescription_id);$("#editOrderHospitalPatientIdInput").val(hospital_patient_id);$("#editOrderPatientDetailsIdInput").val(patient_details_id);$("#editOrderDiscountInput").val(discount);$("#editOrderStatusInput").val(status);$("#editOrderOrderDateInput").val(order_date);
				}
				$("#editOrderForm").on('submit',(ev) => {
					ev.preventDefault();
					updateOrder();
				})

			
				function deleteOrder(id) {
				  $.ajax({
				    url: "/admin/deleteorder",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Order Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrders();
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
			

				async function deleteOrderModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteOrder(id);
				  }
				}
			
				function bulkDeleteOrder(ids) {
				  $.ajax({
				    url: "/admin/bulkdeleteorder",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Orders Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrders();
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
			

				async function bulkDeleteOrderModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteOrder(ids);
				  }
				};

			