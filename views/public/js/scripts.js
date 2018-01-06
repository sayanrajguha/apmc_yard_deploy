$(document).ready(function() {

  $.get("https://apmc-yard.herokuapp.com/apmc/api/user/getUserSuggestions", function(data){
    $("#owner_id").typeahead({
      source:data,
      minLength : 0,
      autoSelect : false,
      fitToElement : true
    });

    // $("#representative_ids").tagsinput({typeahead :
    //   {
    //   items: 4,
    //   source: ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
    //   "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin",
    //   "Wyoming"];
    //   }});
  },'json');
});
