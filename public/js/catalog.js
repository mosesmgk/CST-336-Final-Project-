/* global $ */
$(document).ready(function() {

  function search() {
    var make = $("#make").val();
    var manufacturer = $("#manufacturer").val();
    var partType = $("#partType").val();
    console.log("make: ", make);
    console.log("manufacturer: ", manufacturer);
    console.log("partType: ", partType);
    $.ajax({
      method: "GET",
      url: "/api/getAllProduct",
      dataType: "json",
      data: {
        "make": make,
        "manufacturer": manufacturer,
        "partType": partType,
      },
      success: function(response) {
        // Validation for input field
        
        $("#productPage").html(
          "<table id='tableInProduct'>"+
               "<tr>" +
                   "<th>ID</th>"+
                   "<th>Picture</th>" +
                   "<th>Name</th>"+
                   "<th>Model</th>"+
                   "<th>Manufacturer</th>"+
                   "<th>Component</th>"+
                   "<th>Price</th>"+
                   "<th>Button</th>"+
               "</tr>"
        );
        for (var i = 0; i < response.length; i++) {
          $("#tableInProduct").append(
            "<tr class='tableInfo' value='" + response[i].id + "'>" +
            "<td id='productID'>" + response[i].id + "</td> " +
            "<td> <img id='productImage' alt='" + response[i].pictureURL + "' src='" + response[i].pictureURL + "' width='200' height='200'></td>" +
            "<td id='productTitle'>" + response[i].make + "</td> " +
            "<td>" + response[i].model + "</td> " +
            "<td>" + response[i].manufacturer + "</td> " +
            "<td>" + response[i].type + "</td> " +
            "<td id='productPrice' >" + response[i].price + "</td> " +
            "<td><button class ='addCart btn btn-primary' value ='" + response[i].id + "'> Add to Cart </td>" +
            "</tr>"
          );
        }
        //$("#displayTable").html("results for " + response[0].make);
      }

    });
  }


  $("#btnSearch").on("click", function(e) {
    e.preventDefault();
    search();
    $("#displayTable").html("");
    // reset table displayed after new search
  });
});
