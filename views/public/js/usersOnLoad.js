$(document).ready(function() {
  getAllUsers(1);

  $("#prevBtn").click(function(event){
    event.preventDefault();
    console.log('prev clicked.');
    var currPage = $('#currPage_user a').text();
    console.log('currPage : '+currPage);
    if(currPage > 1) {
      getAllUsers(currPage-1);
    }
  });

  $("#nxtBtn").click(function(event){
    event.preventDefault();
    console.log('next clicked.');
    var currPage = $('#currPage_user a').text();
    console.log('currPage : '+currPage);
    if(currPage >= 1) {
      getAllUsers(Number(currPage)+1);
    }
  });


});
