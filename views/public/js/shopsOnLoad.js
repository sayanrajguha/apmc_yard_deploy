$(document).ready(function() {
  getAllShops(1);

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
    if(currPage >= 1) {
      getAllShops(Number(currPage)+1);
    }
  });


});
