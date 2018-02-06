$(document).ready(function() {
  // Activate tooltip
	$('[data-toggle="tooltip"]').tooltip();

	// Select/Deselect checkboxes
	$("#shopsTable #selectAll").click(function(e){
		console.log('clicked');
		if($('#shopsTable #selectAll').is(':checked')){
			$('#shopsTable .tableCheckbox').prop('checked',true);
		} else{
			$('#shopsTable .tableCheckbox').prop('checked',false);
		}
	});

	$("#usersTable #selectAll").click(function(e){
		console.log('clicked');
		if($('#usersTable #selectAll').is(':checked')){
			console.log('here');
			$('#usersTable .tableCheckBox').prop('checked',true);
		} else{
			$('#usersTable .tableCheckBox').prop('checked',false);
		}
	});

	$('#shopsTable').on('click','input[type="checkbox"]:not("#selectAll")',function(e){
		console.log('others clicked');
		if(!$('#'+$(this).prop('id')).is(':checked')) {
			console.log('yeah');
			$('#shopsTable input:checkbox[id="selectAll"]').prop('checked',false);
		}
	});

	$('#usersTable').on('click','input[type="checkbox"]:not("#selectAll")',function(e){
		console.log('others clicked');
		if(!$('#'+$(this).prop('id')).is(':checked')) {
			console.log('yeah');
			$('#usersTable input:checkbox[id="selectAll"]').prop('checked',false);
		}
	});

	$('#confirmDeleleShops').click(function(event) {
		event.preventDefault();
		console.log('confirming delete operation');
		var shopIds = [];
		$('input:checkbox[name="options[]"]').each(function(index) {
			if($(this).is(':checked')) {
				shopIds.push($(this).val());
			}
		});
		if(shopIds && shopIds.length >= 1) {
			$('#pleaseWaitDialog').modal('show');
			$.ajax({
	            type        : 'DELETE',
	            // url         : 'http://localhost:3000/apmc/api/shop/deleteShop',
	            url         : 'https://apmc-yard.herokuapp.com/apmc/api/shop/deleteShop',
	            data        : {
															"ids" : shopIds
														},
	            dataType    : 'json',
	            encode : false
	        })
	        .done(function(data) {
						$('#pleaseWaitDialog').modal('hide');
	            console.log(data);
	            if(data && data.statusCode == '200' && data.status == 'success') {
	              var successModal = $('#successModal');
	              // $('#shopId').html(data.id);
								// $('#addShopModal').modal('hide');
								$('#deleteModal').modal('hide');
								$('#successModal #action').html('deleted');
								$('#successModal #textID').hide();
								$('#successModal #textInfo').hide();
								successModal.modal('show');
	              // $('#registerForm')[0].reset();
	              // $('#representative_ids').val();
	              // $('#representative_ids').tokenfield('setTokens',[]);
	            }
	        });
		} else {
			$('#deleteModal').modal('hide');
		}
	});

	$('#confirmDeleleUsers').click(function(event) {
		event.preventDefault();
		console.log('confirming delete users operation');
		var userIds = [];
		$('input:checkbox[name="options[]"]').each(function(index) {
			if($(this).is(':checked')) {
				userIds.push($(this).val());
			}
		});
		if(userIds && userIds.length >= 1) {
			$('#pleaseWaitDialog').modal('show');
			$.ajax({
	            type        : 'DELETE',
	            // url         : 'http://localhost:3000/apmc/api/user/deleteUser',
	            url         : 'https://apmc-yard.herokuapp.com/apmc/api/user/deleteUser',
	            data        : {
															"ids" : userIds
														},
	            dataType    : 'json',
	            encode : false
	        })
	        .done(function(data) {
						$('#pleaseWaitDialog').modal('hide');
	            console.log(data);
	            if(data && data.statusCode == '200' && data.status == 'success') {
	              var successModal = $('#successModal');
	              // $('#shopId').html(data.id);
								// $('#addShopModal').modal('hide');
								$('#deleteModal').modal('hide');
								$('#successModal #action').html('deleted');
								$('#successModal #textID').hide();
								$('#successModal #textInfo').hide();
								successModal.modal('show');
	              // $('#registerForm')[0].reset();
	              // $('#representative_ids').val();
	              // $('#representative_ids').tokenfield('setTokens',[]);
	            }
	        });
		} else {
			$('#deleteModal').modal('hide');
		}
	});

  $('#addShopModal').on('click','#saveNewShopBtn',function(event) {
    event.preventDefault();
    var formValid = $('#addShopModal #registerForm').valid();
		if(formValid) {
			var owner_id = $('#owner_id').val();
	    if(owner_id != undefined && owner_id.trim() != '') {
	      owner_id = owner_id.slice(owner_id.lastIndexOf('-')+1).trim();
	    }
	    var representative_ids = [];
	    var representative_ids_val = $('#representative_ids').val();
	    if(representative_ids_val != undefined && representative_ids_val.trim() != '') {
	        var rep_ids = representative_ids_val.split(',');
	        if(rep_ids != undefined && rep_ids.length > 0)
	          for(var i=0;i<rep_ids.length;i++) {
	            var id = rep_ids[i];
	            id = id.slice(id.lastIndexOf('-')+1).trim();
	            if(representative_ids.indexOf(id) == -1) {
	                representative_ids.push(id);
	            }
	          }
	    }
	    var formData = {
	      'name':$('#shopName').val(),
	      'address':$('#shopAddress').val(),
	      'owner_id': owner_id,
	      'representative_ids' : representative_ids,
	      'contact' : $('#contact').val(),
	      'price' : $('#price').val(),
	      'tenure' : $('#tenure').val()
	    };
	    console.log(formData);
			$('#pleaseWaitDialog').modal('show');
	    $.ajax({
	            type        : 'POST',
	            // url         : 'http://localhost:3000/apmc/api/registerShop',
	            url         : 'https://apmc-yard.herokuapp.com/apmc/api/registerShop',
	            data        : formData,
	            dataType    : 'json',
	            encode : false
	        })
	        .done(function(data) {
						$('#pleaseWaitDialog').modal('hide');
	            console.log(data);
	            if(data && data.statusCode == '200' && data.status == 'success') {
	              var successModal = $('#successModal');
	              $('#shopId').html(data.id);
								$('#addShopModal').modal('hide');
								$('#successModal #action').html('saved');
								$('#successModal #textID').show();
								$('#successModal #textInfo').show();
	              successModal.modal('show');
	              $('#registerForm')[0].reset();
	              $('#representative_ids').val();
	              $('#representative_ids').tokenfield('setTokens',[]);
	            }
	        });
		}
  });

	$('#addShopModal').on('click','#editNewShopBtn',function(event) {
		console.log('edit btn clicked');
    event.preventDefault();
    var owner_id = $('#owner_id').val();
    if(owner_id != undefined && owner_id.trim() != '') {
      owner_id = owner_id.slice(owner_id.lastIndexOf('-')+1).trim();
    }
    var representative_ids = [];
    var representative_ids_val = $('#representative_ids').val();
    if(representative_ids_val != undefined && representative_ids_val.trim() != '') {
        var rep_ids = representative_ids_val.split(',');
        if(rep_ids != undefined && rep_ids.length > 0)
          for(var i=0;i<rep_ids.length;i++) {
            var id = rep_ids[i];
            id = id.slice(id.lastIndexOf('-')+1).trim();
            if(representative_ids.indexOf(id) == -1) {
                representative_ids.push(id);
            }
          }
    }
    var formData = {
      'name':$('#shopName').val(),
      'address':$('#shopAddress').val(),
      'owner_id': owner_id,
      'representative_ids' : representative_ids,
      'contact' : $('#contact').val(),
      'price' : $('#price').val(),
      'tenure' : $('#tenure').val()
    };
    console.log(formData);
		$('#pleaseWaitDialog').modal('show');
    $.ajax({
            type        : 'PUT',
            // url         : 'http://localhost:3000/apmc/api/shop/editShop/'+$('#_id').val(),
            url         : 'https://apmc-yard.herokuapp.com/apmc/api/shop/editShop/'+$('#_id').val(),
            data        : formData,
            dataType    : 'json',
            encode : false
        })
        .done(function(data) {
					$('#pleaseWaitDialog').modal('hide');
            console.log(data);
            if(data && data.statusCode == '200' && data.status == 'success') {
              var successModal = $('#successModal');
              // $('#shopId').html(data.id);
							$('#addShopModal').modal('hide');
							$('#successModal #textID').hide();
							$('#successModal #textInfo').hide();
							$('#successModal #action').html('updated');
              successModal.modal('show');
              $('#registerForm')[0].reset();
              $('#representative_ids').val();
              $('#representative_ids').tokenfield('setTokens',[]);
            }
        });
  });

	$('#addShopModal').on('hidden.bs.modal', function(event){
		$('#addShopModal #editNewShopBtn').attr('id','saveNewShopBtn');
	});

	$('#shopsTable').on('click','.editShop',function(event) {
			event.preventDefault();
			var shopId=$(this).attr('id');
			console.log('Edit shop with id : '+shopId);
			$('#pleaseWaitDialog').modal('show');
			// $.get("http://localhost:3000/apmc/api/shop/getShop/"+shopId, function(data){
			$.get("https://apmc-yard.herokuapp.com/apmc/api/shop/getShop/"+shopId, function(data){
				$('#pleaseWaitDialog').modal('hide');
				console.log('data');
				console.log(data);
				if(data && data.statusCode =='200' && data.status == 'success' && data.shop) {
					$('#addShopModal #_id').val(data.shop.id);
					$('#addShopModal #shopName').val(data.shop.name);
					$('#addShopModal #shopAddress').val(data.shop.address);
					$('#addShopModal #contact').val(data.shop.contact);
					console.log(data.shop.contact);
					$('#addShopModal #price').val(data.shop.price);
					$('#addShopModal #tenure').val(Number(data.shop.tenure));
					$('#addShopModal #owner_id').val(data.shop.owner_id);
					$('#addShopModal #representative_ids').tokenfield('setTokens',data.shop.representative_ids.toString());
					$('#addShopModal #saveNewShopBtn').attr('id','editNewShopBtn');
					$('#addShopModal').modal('show');
				}
			});
	});

	$('#addUserModal').on('click','#saveNewUserBtn',function(event) {
    event.preventDefault();
		var formValid = $('#addUserModal #registerForm').valid();
		console.log(formValid);
    if(formValid) {
			var owner_id = $('#owner_id').val();
	    var formData = {
	      'name':$('#user_name').val(),
	      'address':$('#address').val(),
	      'contact' : $('#contact').val(),
	      'email' : $('#email').val(),
	      'role' : $('#role').val(),
				'username' : $('#username').val(),
				'password' : $('#password').val()
	    };
	    console.log(formData);
			$('#pleaseWaitDialog').modal('show');
	    $.ajax({
	            type        : 'POST',
	            // url         : 'http://localhost:3000/apmc/api/registerUser',
	            url         : 'https://apmc-yard.herokuapp.com/apmc/api/registerUser',
	            data        : formData,
	            dataType    : 'json',
	            encode : false
	        })
	        .done(function(data) {
						$('#pleaseWaitDialog').modal('hide');
	            console.log(data);
	            if(data && data.statusCode == '200' && data.status == 'success') {
	              var successModal = $('#successModal');
	              $('#userId').html(data.username);
								$('#addUserModal').modal('hide');
								$('#successModal #action').html('saved');
								$('#successModal #textID').show();
								$('#successModal #textInfo').show();
	              successModal.modal('show');
	              $('#registerForm')[0].reset();
	            }
	        });
		}
  });

	$('#addUserModal').on('click','#editNewUserBtn',function(event) {
		console.log('edit user btn clicked');
    event.preventDefault();
		var formValid = $('#addUserModal #registerForm').valid();
		if(formValid) {
			var formData = {
	      'name':$('#user_name').val(),
	      'address':$('#address').val(),
	      'contact' : $('#contact').val(),
	      'email' : $('#email').val(),
	      'role' : $('#role').val(),
				'username' : $('#username').val()
	    };
	    console.log(formData);
			$('#pleaseWaitDialog').modal('show');
	    $.ajax({
	            type        : 'PUT',
	            // url         : 'http://localhost:3000/apmc/api/user/editUser/'+$('#_id').val(),
	            url         : 'https://apmc-yard.herokuapp.com/apmc/api/user/editUser/'+$('#_id').val(),
	            data        : formData,
	            dataType    : 'json',
	            encode : false
	        })
	        .done(function(data) {
						$('#pleaseWaitDialog').modal('hide');
	            console.log(data);
	            if(data && data.statusCode == '200' && data.status == 'success') {
	              var successModal = $('#successModal');
	              // $('#shopId').html(data.id);
								$('#addUserModal').modal('hide');
								$('#successModal #textID').hide();
								$('#successModal #textInfo').hide();
								$('#successModal #action').html('updated');
	              successModal.modal('show');
	              $('#registerForm')[0].reset();
	            }
	        });
		}
  });

	$('#addUserModal').on('hidden.bs.modal', function(event){
		$('#addUserModal #editNewUserBtn').attr('id','saveNewUserpBtn');
		$('#addUserModal #passwordRow').show();
	});

	$('#addUserModal').on('click', '#showPassBtn', function(event){
		console.log('show pass clicked');
		$('#addUserModal #showPass').toggleClass('fa-eye-slash');
		$('#addUserModal #showPass').toggleClass('fa-eye');
		var passwordField = $('#addUserModal #password');
		if(passwordField.attr('type') == 'text') {
			passwordField.attr('type','password');
		} else if(passwordField.attr('type') == 'password') {
			passwordField.attr('type','text');
		}

	});

	$('#usersTable').on('click','.editUser',function(event) {
			event.preventDefault();
			var userId=$(this).attr('id');
			console.log('Edit user with id : '+userId);
			$('#pleaseWaitDialog').modal('show');
			// $.get("http://localhost:3000/apmc/api/user/getUser/"+userId, function(data){
			$.get("https://apmc-yard.herokuapp.com/apmc/api/user/getUser/"+userId, function(data){
				$('#pleaseWaitDialog').modal('hide');
				console.log('data');
				console.log(data);
				if(data && data.statusCode =='200' && data.status == 'success') {
					$('#addUserModal #_id').val(data.id);
					$('#addUserModal #user_name').val(data.name);
					$('#addUserModal #address').val(data.address);
					$('#addUserModal #contact').val(data.contact);
					$('#addUserModal #email').val(data.email);
					$('#addUserModal #role').val(data.role);
					$('#addUserModal #username').val(data.username);
					$('#addUserModal #saveNewUserBtn').attr('id','editNewUserBtn');
					$('#addUserModal #passwordRow').hide();
					$('#addUserModal').modal('show');
				}
			});
	});


// validations binding
	$('#addUserModal #registerForm').validate({
		errorPlacement : function(error,element) {
			if(element.attr('id') == 'password') {
				error.insertAfter('#pwdInputGroup');
			} else {
				error.insertAfter(element);
			}
		},
	  rules : {
	    name : {
	      required : true,
	      minlength : 2,
	      maxlength : 15
	    },
	    address : {
	      required : true,
	      minlength : 5,
	      maxlength : 100
	    },
	    contact : {
	      required : true,
	      number : true,
	      minlength : 8,
	      maxlength : 10
	    },
	    email : {
	      required : true,
	      email : true
	    },
	    username : {
	      required : true
	    },
	    password : {
	      required : true
	    }
	  },
	  messages : {
	    name : {
	      required : "Name is required",
	      minlength : "Name should be atleast 2 character long",
	      maxlength : "Name is too long"
	    },
	    address : {
	      required : "Address is required",
	      minlength : "Address too short",
	      maxlength : "Address too long"
	    },
	    contact : {
	      required : "Contact is required",
	      number : "Not a valid contact number",
	      minlength : "Contact number should be between 8-10 digits",
	      maxlength : "Contact number should be between 8-10 digits"
	    },
	    email : {
	      required : "Email is required",
	      email : "Not a valid email"
	    },
	    username : {
	      required : "username is required"
	    },
	    password : {
	      required : "password is required"
	    }
	  }
	});

	$('#addShopModal #registerForm').validate({
	  rules : {
	    name : {
	      required : true,
	      minlength : 2,
	      maxlength : 30
	    },
	    address : {
	      required : true,
	      minlength : 3,
	      maxlength : 100
	    },
	    contact : {
	      required : true,
	      number : true,
	      minlength : 8,
	      maxlength : 10
	    },
	    price : {
	      required : true,
	      number : true
	    },
	    tenure : {
	      required : true,
				number : true
	    }
	  },
	  messages : {
			name : {
	      required : "Shop name required",
	      minlength : "Shop name too short",
	      maxlength : "Shop name too long"
	    },
	    address : {
	      required : "Shop address required",
	      minlength : "Shop address too short",
	      maxlength : "Shop address too long"
	    },
	    contact : {
	      required : "Contact number required",
	      number : "Invalid contact number",
	      minlength : "Contact number should be within 8-10 digits",
	      maxlength : "Contact number should be within 8-10 digits"
	    },
	    price : {
	      required : "Price is required",
	      number : "Invalid value for price"
	    },
	    tenure : {
	      required : "Tenure is required",
				number : "Invalid value for tenure"
	    }
	  }
	});

});

//Global functions providing AJAX Calls
function getUserSuggestions() {
  console.log('user suggestions called...');
  // $.get("http://localhost:3000/apmc/api/user/getUserSuggestions", function(data){
  $.get("https://apmc-yard.herokuapp.com/apmc/api/user/getUserSuggestions", function(data){
		if(data && data.owners && data.owners.length >= 1) {
			console.log('owner suggestions retreived');
			$('#owner_id').autocomplete({
				source : data.owners,
				minlength : 0
			});
		}
		if(data && data.reps && data.reps.length >= 1) {
			console.log('rep suggestions retreived');
			$('#representative_ids').tokenfield({
				autocomplete: {
					source: data.reps,
					delay: 100
				},
				showAutocompleteOnFocus: true
			});
		}
  },'json');
}

function getAllShops(pageNo) {
  $('#shopsTable tbody').empty();
  $('#pleaseWaitDialog').modal('show');
  // $.get("http://localhost:3000/apmc/api/shop/getAllShops/"+pageNo, function(data){
  $.get("https://apmc-yard.herokuapp.com/apmc/api/shop/getAllShops/"+pageNo, function(data){
    if(data && data.statusCode == '200' && data.status == 'success' && data.shops) {
      console.log('shops retreived...');
      var shops = data.shops;
      var table = $('#shopsTable tbody');
      for(var i=0;i<shops.length;i++) {
        var repIdString = '';
        for(var j=0;j<shops[i].representative_ids.length;j++) {
          repIdString = repIdString + '<br />' + shops[i].representative_ids[j];
        }
        var row = '<tr><td><span class="custom-checkbox"><input type="checkbox" class="tableCheckbox" id="checkbox'+(i+1)+'" name="options[]" value="'+ shops[i]._id +'"><label for="checkbox'+(i+1)+'"></label></span></td><td>'+shops[i]._id+'</td><td>'+ shops[i].name +'</td><td>'+ shops[i].address+'</td><td>'+ shops[i].contact +'</td><td><strong>Owner</strong> :<br />'+shops[i].owner_id+'<br /><strong>Representatives</strong> : '+repIdString+'</td><td><a href="javascript:void(0)" id="'+shops[i]._id+'" class="editShop"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a></td></tr>';
        table.append(row);
      }
      $('#currPage a').html(data.page);
      $('#entries').html(data.entries);
      $('#total').html(data.total);
			$('#totalPages').val(data.totalPages);
      $('#lastPage a').html(data.totalPages);
			console.log('Page : '+data.page);
			console.log('Total Pages : '+data.totalPages);
      if(data.page == '1') {
        $('#prevBtn').removeAttr('href').css('cursor','not-allowed');
        $('#startingPage').addClass('invisible');
      } else {
        $('#prevBtn').attr('href','javascript:void(0)').css('cursor','pointer');;
        $('#startingPage').removeClass('invisible');
      }
      if(data.page == data.totalPages) {
				console.log('entering');
        $('#nxtBtn').removeAttr('href').css('cursor','not-allowed');
        $('#lastPage').addClass('invisible');
      } else {
				console.log('not entering');
        $('#nxtBtn').attr('href','javascript:void(0)').css('cursor','pointer');;
        $('#lastPage').removeClass('invisible');
      }
    }
    $('#pleaseWaitDialog').modal('hide');
  },'json');
}

function getAllUsers(pageNo) {
  console.log('getAllUsers called');
  $('#usersTable tbody').empty();
  $('#pleaseWaitDialog').modal('show');
  // $.get("http://localhost:3000/apmc/api/user/getAllUsers/"+pageNo, function(data){
  $.get("https://apmc-yard.herokuapp.com/apmc/api/user/getAllUsers/"+pageNo, function(data){
    if(data && data.statusCode == '200' && data.status == 'success' && data.users && data.users.length > 0) {
      console.log('users retreived...');
      var users = data.users;
			console.log(users);
      var table = $('#usersTable tbody');
      for(var i=0;i<users.length;i++) {
        var row = '<tr><td><span class="custom-checkbox"><input type="checkbox" class="tableCheckBox" id="checkbox'+(i+1)+'" name="options[]" value="'+ users[i].id +'"><label for="checkbox'+(i+1)+'"></label></span></td><td>'+users[i].name+'</td><td>'+ users[i].address +'</td><td>'+ users[i].contact+'</td><td>'+ users[i].email +'</td><td>'+users[i].role+'</td><td>'+users[i].username+'</td><td>'+ users[i].shopDetails +'</td><td><a href="javascript:void(0)" id="'+users[i].id+'" class="editUser"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a></td></tr>';
        table.append(row);
      }
      $('#currPage_user a').html(data.page);
      $('#entries_users').html(data.entries);
      $('#total_users').html(data.total);
			$('#totalPages').val(data.totalPages);
      $('#lastPage_user a').html(data.totalPages);
      if(data.page == '1') {
        $('#prevBtn').removeAttr('href').css('cursor','not-allowed');
        $('#startingPage_user').addClass('invisible');
      } else {
        $('#prevBtn').attr('href','javascript:void(0)').css('cursor','pointer');;
        $('#startingPage_user').removeClass('invisible');
      }
      if(data.page == data.totalPages) {
				console.log('last page');
        $('#next').addClass('disabled');
        $('#nxtBtn').removeAttr('href').css('cursor','not-allowed');
        $('#lastPage_user').addClass('invisible');
      } else {
        $('#next').removeClass('disabled');
        $('#nxtBtn').attr('href','javascript:void(0)').css('cursor','pointer');;
        $('#lastPage_user').removeClass('invisible');
      }
    }
    $('#pleaseWaitDialog').modal('hide');
  },'json');
}
