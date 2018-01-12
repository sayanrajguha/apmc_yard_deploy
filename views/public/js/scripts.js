$(document).ready(function() {
  // Activate tooltip
	$('[data-toggle="tooltip"]').tooltip();

	// Select/Deselect checkboxes
	var checkbox = $('table tbody input[type="checkbox"]');
	$("#selectAll").click(function(){
		if(this.checked){
			checkbox.each(function(){
				this.checked = true;
			});
		} else{
			checkbox.each(function(){
				this.checked = false;
			});
		}
	});
	checkbox.click(function(){
		if(!this.checked){
			$("#selectAll").prop("checked", false);
		}
	});

  $('#registerForm').submit(function(event) {
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
      'address':$('#address').val(),
      'owner_id': owner_id,
      'representative_ids' : representative_ids,
      'contact' : $('#contact').val(),
      'price' : $('#price').val(),
      'tenure' : $('#tenure').val()
    };
    console.log(formData);

    $.ajax({
            type        : 'POST',
            // url         : 'http://localhost:3000/apmc/api/registerShop',
            url         : 'https://apmc-yard.herokuapp.com/apmc/api/registerShop',
            data        : formData,
            dataType    : 'json',
            encode : false
        })
        .done(function(data) {
            console.log(data);
            if(data && data.statusCode == '200' && data.status == 'success') {
              var successModal = $('#successModal');
              $('#shopId').html(data.id);
              successModal.modal('show');
              $('#registerForm')[0].reset();
              $('#representative_ids').val();
              $('#representative_ids').tokenfield('setTokens',[]);
            }
        });
  });
});


//Global functions providing AJAX Calls
function getUserSuggestions() {
  console.log('user suggestions called...');
  // $.get("http://localhost:3000/apmc/api/user/getUserSuggestions", function(data){
  $.get("https://apmc-yard.herokuapp.com/apmc/api/user/getUserSuggestions", function(data){
    console.log('user suggestions retreived');
    $('#owner_id').autocomplete({
      source : data,
      minLength : 0
    });
    $('#representative_ids').tokenfield({
      autocomplete: {
        source: data,
        delay: 100
      },
      showAutocompleteOnFocus: true
    });
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
        var row = '<tr><td><span class="custom-checkbox"><input type="checkbox" id="checkbox'+(i+1)+'" name="options[]" value="1"><label for="checkbox'+(i+1)+'"></label></span></td><td>'+shops[i]._id+'</td><td>'+ shops[i].name +'</td><td>'+ shops[i].address+'</td><td>'+ shops[i].contact +'</td><td><strong>Owner</strong> :<br />'+shops[i].owner_id+'<br /><strong>Representatives</strong> : '+repIdString+'</td><td><a href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a><a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a></td></tr>';
        table.append(row);
      }
      $('#currPage a').html(data.page);
      $('#entries').html(data.entries);
      $('#total').html(data.total);
      $('#lastPage a').html(data.totalPages);
      if(data.page == '1') {
        $('#previous a').removeAttr('href').css('cursor','not-allowed');
        $('#startingPage').addClass('invisible');
      } else {
        $('#previous a').attr('href','javascript:void(0)').css('cursor','pointer');;
        $('#startingPage').removeClass('invisible');
      }
      if(data.page == data.totalPages) {
        $('#next a').removeAttr('href').css('cursor','not-allowed');
        $('#lastPage').addClass('invisible');
      } else {
        $('#next a').attr('href','javascript:void(0)').css('cursor','pointer');;
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
      var table = $('#usersTable tbody');
      for(var i=0;i<users.length;i++) {
        var row = '<tr><td><span class="custom-checkbox"><input type="checkbox" id="checkbox'+(i+1)+'" name="options[]" value="1"><label for="checkbox'+(i+1)+'"></label></span></td><td>'+users[i].name+'</td><td>'+ users[i].address +'</td><td>'+ users[i].contact+'</td><td>'+ users[i].email +'</td><td>'+users[i].role+'</td><td>'+users[i].username+'</td><td>'+ users[i].shopDetails +'</td><td><a href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a><a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a></td></tr>';
        table.append(row);
      }
      $('#currPage_user a').html(data.page);
      $('#entries_users').html(data.entries);
      $('#total_users').html(data.total);
      $('#lastPage_user a').html(data.totalPages);
      if(data.page == '1') {
        $('#previous a').removeAttr('href').css('cursor','not-allowed');
        $('#startingPage_user').addClass('invisible');
      } else {
        $('#previous a').attr('href','javascript:void(0)').css('cursor','pointer');;
        $('#startingPage_user').removeClass('invisible');
      }
      if(data.page == data.totalPages) {
        $('#next').addClass('disabled');
        $('#next a').removeAttr('href').css('cursor','not-allowed');
        $('#lastPage_user').addClass('invisible');
      } else {
        $('#next').removeClass('disabled');
        $('#next a').attr('href','javascript:void(0)').css('cursor','pointer');;
        $('#lastPage_user').removeClass('invisible');
      }
    }
    $('#pleaseWaitDialog').modal('hide');
  },'json');
}
