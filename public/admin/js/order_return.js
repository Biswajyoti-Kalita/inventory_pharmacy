

			$(document).ready(function(){
				getOrder_returns();
			});

			var Order_returnTableOffset = 0;
			var Order_returnTableLimit = 10;
			var Order_returnTableOrderField = 'id';
			var Order_returnTableOrderFieldBy = 'DESC';

			function updateOrder_returnsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+Order_returnTableOrderField+"Sort"+Order_returnTableOrderFieldBy).removeClass("fade-l");
			}

			function getOrder_returns(searchObj) {
				
				updateOrder_returnsTableHeaderSort();


				  	const data = {
				    	offset: Order_returnTableOffset,
				    	limit : Order_returnTableLimit,
				    	order: Order_returnTableOrderField,
				    	order_by: Order_returnTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getorder_returns",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#order_returnTableBody").html('');

				       $("#addOrder_return").html("");  
				       $("#editOrder_return").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#order_returnTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Order_return')" type="checkbox" class=" checkbox-Order_return "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].order_item_id ? result[i].order_item_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].quantity ? result[i].quantity : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editOrder_returnModal(  '${result[i].order_item_id}', '${result[i].quantity}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteOrder_returnModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeOrder_returnsTableOffset,Order_returnTableLimit,Order_returnTableOffset,'Order_return')
				    },
				  });
				}


				function changeOrder_returnsTableOffset(num) {
					Order_returnTableOffset  = num;
					getOrder_returns();
				}
				function changeOrder_returnsTableLimit(num) {
					Order_returnTableLimit  = num;
					getOrder_returns();
				}
				function changeOrder_returnsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					Order_returnTableOrderField  = order_field;
					Order_returnTableOrderFieldBy  = order_field_by;
					getOrder_returns();
				}


		
				var tempForm = "";
				$("#searchOrder_returnForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchOrder_returnForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getOrder_returns(searchObj);
				})
			
				function addOrder_return() {
				  $.ajax({
				    url: "/admin/addorder_return",
				    method: "POST",
				    data: {
				    	order_item_id :  $("#addOrderReturnOrderItemIdInput").val() ,quantity :  $("#addOrderReturnQuantityInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addOrder_returnForm input, #addOrder_returnForm textarea").val('')
				        $("#addOrder_returnModal").modal('hide');
				        swal({
				          title: "Order_return Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrder_returns();
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
			
				$("#addOrder_returnForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addOrder_return();
				})
				function addOrder_returnModal(){
				  $("#addOrder_returnModal").modal('show');					
				}
			
				function updateOrder_return()  {
				  $.ajax({
				    url: "/admin/updateorder_return",
				    method: "POST",
				    data: {
				    	order_item_id : $("#editOrderReturnOrderItemIdInput").val(),quantity : $("#editOrderReturnQuantityInput").val(),id : $("#editOrderReturnOrder_returnId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editOrder_returnForm input, #editOrder_returnForm textarea").val('')
				        $("#editOrder_returnModal").modal('hide');
				        swal({
				          title: "Order_return Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrder_returns();
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
			
				function editOrder_returnModal(order_item_id,quantity,id) {
				  $("#editOrder_returnModal").modal('show');
				  $("#editOrderReturnOrder_returnId").val(id);
				  $("#editOrderReturnOrderItemIdInput").val(order_item_id);$("#editOrderReturnQuantityInput").val(quantity);
				}
				$("#editOrder_returnForm").on('submit',(ev) => {
					ev.preventDefault();
					updateOrder_return();
				})

			
				function deleteOrder_return(id) {
				  $.ajax({
				    url: "/admin/deleteorder_return",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Order_return Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrder_returns();
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
			

				async function deleteOrder_returnModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteOrder_return(id);
				  }
				}
			
				function bulkDeleteOrder_return(ids) {
				  $.ajax({
				    url: "/admin/bulkdeleteorder_return",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Order_returns Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrder_returns();
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
			

				async function bulkDeleteOrder_returnModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteOrder_return(ids);
				  }
				};

			