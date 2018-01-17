$(document).ready(function() {
  getAllShops(1);
  getUserSuggestions();
  $("#prevBtn").click(function(event){
    event.preventDefault();
    console.log('prev clicked.');
    var currPage = $('#currPage a').text();
    console.log('currPage : '+currPage);
    if(currPage > 1) {
      getAllShops(currPage-1);
    }
  });

  $("#nxtBtn").click(function(event){
    event.preventDefault();
    console.log('next clicked.');
    var currPage = $('#currPage a').text();
    console.log('currPage : '+currPage);
    console.log($('#totalPages').val());
    if(currPage >= 1 && currPage != $('#totalPages').val()) {
      getAllShops(Number(currPage)+1);
    }
  });
});
