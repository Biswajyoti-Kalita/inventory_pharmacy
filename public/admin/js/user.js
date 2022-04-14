

			$(document).ready(function(){
				getUsers();
			});

			var UserTableOffset = 0;
			var UserTableLimit = 10;
			var UserTableOrderField = 'id';
			var UserTableOrderFieldBy = 'DESC';

			function updateUsersTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+UserTableOrderField+"Sort"+UserTableOrderFieldBy).removeClass("fade-l");
			}

			function getUsers(searchObj) {
				
				updateUsersTableHeaderSort();


				  	const data = {
				    	offset: UserTableOffset,
				    	limit : UserTableLimit,
				    	order: UserTableOrderField,
				    	order_by: UserTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getusers",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#userTableBody").html('');

				       $("#addUser").html("");  
				       $("#editUser").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#userTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('User')" type="checkbox" class=" checkbox-User "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
						<td>${ result[i] ? result[i].first_name ? result[i].first_name : ' '  : ' '   }</td>
						<td>${ result[i] ? result[i].last_name ? result[i].last_name : ' '  : ' '   }</td>
						<td>${ result[i] ? result[i].phone ? result[i].phone : ' '  : ' '   }</td>
						<td>${ result[i] ? result[i].email ? result[i].email : ' '  : ' '   }</td><td>${ [ "admin","pharmacies" ][result[i].role_id]}</td><td><span class="btn btn-link btn-sm" onclick="editUserModal(  '${result[i].first_name}', '${result[i].last_name}', '${result[i].phone}', '${result[i].email}', '${result[i].password}', '${result[i].role_id}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteUserModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeUsersTableOffset,UserTableLimit,UserTableOffset,'User')
				    },
				  });
				}


				function changeUsersTableOffset(num) {
					UserTableOffset  = num;
					getUsers();
				}
				function changeUsersTableLimit(num) {
					UserTableLimit  = num;
					getUsers();
				}
				function changeUsersTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					UserTableOrderField  = order_field;
					UserTableOrderFieldBy  = order_field_by;
					getUsers();
				}


		
				var tempForm = "";
				$("#searchUserForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchUserForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getUsers(searchObj);
				})
			
				function addUser() {
				  $.ajax({
				    url: "/admin/adduser",
				    method: "POST",
				    data: {
				    	first_name :  $("#addUserFirstNameInput").val() ,last_name :  $("#addUserLastNameInput").val() ,phone :  $("#addUserPhoneInput").val() ,email :  $("#addUserEmailInput").val() ,password :  $("#addUserPasswordInput").val() ,role_id :  $("#addUserRoleIdInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addUserForm input, #addUserForm textarea").val('')
				        $("#addUserModal").modal('hide');
				        swal({
				          title: "User Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getUsers();
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
			
				$("#addUserForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addUser();
				})
				function addUserModal(){
				  $("#addUserModal").modal('show');					
				}
			
				function updateUser()  {
				  $.ajax({
				    url: "/admin/updateuser",
				    method: "POST",
				    data: {
				    	first_name : $("#editUserFirstNameInput").val(),last_name : $("#editUserLastNameInput").val(),phone : $("#editUserPhoneInput").val(),email : $("#editUserEmailInput").val(),password : $("#editUserPasswordInput").val(),role_id : $("#editUserRoleIdInput").val(),id : $("#editUserUserId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editUserForm input, #editUserForm textarea").val('')
				        $("#editUserModal").modal('hide');
				        swal({
				          title: "User Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getUsers();
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
			
				function editUserModal(first_name,last_name,phone,email,password,role_id,id) {
				  $("#editUserModal").modal('show');
				  $("#editUserUserId").val(id);
				  $("#editUserFirstNameInput").val(first_name);$("#editUserLastNameInput").val(last_name);$("#editUserPhoneInput").val(phone);$("#editUserEmailInput").val(email);$("#editUserPasswordInput").val(password);$("#editUserRoleIdInput").val(role_id);
				}
				$("#editUserForm").on('submit',(ev) => {
					ev.preventDefault();
					updateUser();
				})

			
				function deleteUser(id) {
				  $.ajax({
				    url: "/admin/deleteuser",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "User Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getUsers();
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
			

				async function deleteUserModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteUser(id);
				  }
				}
			
				function bulkDeleteUser(ids) {
				  $.ajax({
				    url: "/admin/bulkdeleteuser",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Users Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getUsers();
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
			

				async function bulkDeleteUserModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteUser(ids);
				  }
				};

			