

			$(document).ready(function(){
				getVendors();
			});

			var VendorTableOffset = 0;
			var VendorTableLimit = 10;
			var VendorTableOrderField = 'id';
			var VendorTableOrderFieldBy = 'DESC';

			function updateVendorsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+VendorTableOrderField+"Sort"+VendorTableOrderFieldBy).removeClass("fade-l");
			}

			function getVendors(searchObj) {
				
				updateVendorsTableHeaderSort();


				  	const data = {
				    	offset: VendorTableOffset,
				    	limit : VendorTableLimit,
				    	order: VendorTableOrderField,
				    	order_by: VendorTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getvendors",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#vendorTableBody").html('');

				       $("#addVendor").html("");  
				       $("#editVendor").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#vendorTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Vendor')" type="checkbox" class=" checkbox-Vendor "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].name ? result[i].name : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].vendor_code ? result[i].vendor_code : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].street_address_1 ? result[i].street_address_1 : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].street_address_2 ? result[i].street_address_2 : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].city ? result[i].city : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].state ? result[i].state : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].country ? result[i].country : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].zip ? result[i].zip : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editVendorModal(  '${result[i].name}', '${result[i].vendor_code}', '${result[i].street_address_1}', '${result[i].street_address_2}', '${result[i].city}', '${result[i].state}', '${result[i].country}', '${result[i].zip}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteVendorModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeVendorsTableOffset,VendorTableLimit,VendorTableOffset,'Vendor')
				    },
				  });
				}


				function changeVendorsTableOffset(num) {
					VendorTableOffset  = num;
					getVendors();
				}
				function changeVendorsTableLimit(num) {
					VendorTableLimit  = num;
					getVendors();
				}
				function changeVendorsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					VendorTableOrderField  = order_field;
					VendorTableOrderFieldBy  = order_field_by;
					getVendors();
				}


		
				var tempForm = "";
				$("#searchVendorForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchVendorForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getVendors(searchObj);
				})
			
				function addVendor() {
				  $.ajax({
				    url: "/admin/addvendor",
				    method: "POST",
				    data: {
				    	name :  $("#addVendorNameInput").val() ,vendor_code :  $("#addVendorVendorCodeInput").val() ,street_address_1 :  $("#addVendorStreetAddress1Input").val() ,street_address_2 :  $("#addVendorStreetAddress2Input").val() ,city :  $("#addVendorCityInput").val() ,state :  $("#addVendorStateInput").val() ,country :  $("#addVendorCountryInput").val() ,zip :  $("#addVendorZipInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addVendorForm input, #addVendorForm textarea").val('')
				        $("#addVendorModal").modal('hide');
				        swal({
				          title: "Vendor Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getVendors();
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
			
				$("#addVendorForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addVendor();
				})
				function addVendorModal(){
				  $("#addVendorModal").modal('show');					
				}
			
				function updateVendor()  {
				  $.ajax({
				    url: "/admin/updatevendor",
				    method: "POST",
				    data: {
				    	name : $("#editVendorNameInput").val(),vendor_code : $("#editVendorVendorCodeInput").val(),street_address_1 : $("#editVendorStreetAddress1Input").val(),street_address_2 : $("#editVendorStreetAddress2Input").val(),city : $("#editVendorCityInput").val(),state : $("#editVendorStateInput").val(),country : $("#editVendorCountryInput").val(),zip : $("#editVendorZipInput").val(),id : $("#editVendorVendorId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editVendorForm input, #editVendorForm textarea").val('')
				        $("#editVendorModal").modal('hide');
				        swal({
				          title: "Vendor Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getVendors();
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
			
				function editVendorModal(name,vendor_code,street_address_1,street_address_2,city,state,country,zip,id) {
				  $("#editVendorModal").modal('show');
				  $("#editVendorVendorId").val(id);
				  $("#editVendorNameInput").val(name);$("#editVendorVendorCodeInput").val(vendor_code);$("#editVendorStreetAddress1Input").val(street_address_1);$("#editVendorStreetAddress2Input").val(street_address_2);$("#editVendorCityInput").val(city);$("#editVendorStateInput").val(state);$("#editVendorCountryInput").val(country);$("#editVendorZipInput").val(zip);
				}
				$("#editVendorForm").on('submit',(ev) => {
					ev.preventDefault();
					updateVendor();
				})

			
				function deleteVendor(id) {
				  $.ajax({
				    url: "/admin/deletevendor",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Vendor Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getVendors();
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
			

				async function deleteVendorModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteVendor(id);
				  }
				}
			
				function bulkDeleteVendor(ids) {
				  $.ajax({
				    url: "/admin/bulkdeletevendor",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Vendors Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getVendors();
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
			

				async function bulkDeleteVendorModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteVendor(ids);
				  }
				};

			