$(document).ready(function() {

  // $.get("http://localhost:3000/apmc/api/user/getUserSuggestions", function(data){
  $.get("https://apmc-yard.herokuapp.com/apmc/api/user/getUserSuggestions", function(data){
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
