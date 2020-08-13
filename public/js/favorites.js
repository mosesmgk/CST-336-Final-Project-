$(document).ready(function() {
    // console.log("starting favorites functions");
    // Function will populate the front index page with a list of three favorite items
    $.ajax({
       method:  "GET",
       url:     "/api/getFavorites",
       dataType:"json",
       success: function(result, status) {
            let total = result.length;
            console.log("All results tallied  "+total);
            console.log(result[total-3].product_id);
        // Total is used to get the last 3 records as the table is growing, and it is never cleaned, this is useful for logging user clicks too.
            $("#favoriteItemId1").html("<p>"+result[total-3].product_id+"</p>");
            $("#favoriteItemType1").html("<p>"+result[total-3].type+"</p>");
            $("#favoriteItemMan1").html("<p>"+result[total-3].manufacturer+"</p>");
            $("#favoriteItemDesc1").html("<p>"+result[total-3].description+"</p>");
            $("#favoriteItemFoto1").html("<br><br><img src="+result[total-3].pictureURL+" alt='Computer Component' width='70'><br>");
            $("#favoriteItemId2").html("<p>"+result[total-2].product_id+"</p>");
            $("#favoriteItemType2").html("<p>"+result[total-2].type+"</p>");
            $("#favoriteItemMan2").html("<p>"+result[total-2].manufacturer+"</p>");
            $("#favoriteItemDesc2").html("<p>"+result[total-2].description+"</p>");
            $("#favoriteItemFoto2").html("<br><br><img src="+result[total-2].pictureURL+" alt='Computer Component' width='70'><br>");
            $("#favoriteItemId3").html("<p>"+result[total-1].product_id+"</p>");
            $("#favoriteItemType3").html("<p>"+result[total-1].type+"</p>");
            $("#favoriteItemMan3").html("<p>"+result[total-1].manufacturer+"</p>");
            $("#favoriteItemDesc3").html("<p>"+result[total-1].description+"</p>");
            $("#favoriteItemFoto3").html("<br><br><img src="+result[total-1].pictureURL+" alt='Computer Component' width='70'><br>");
       }
    });
});