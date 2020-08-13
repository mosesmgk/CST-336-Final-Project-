/* global $ */ /* global localStorage */ /* global location */
$(document).ready(function() {
  $(document).on("click", ".item1Button", function(e) {
    let itemID = $('#favoriteItemId1').text();
    console.log("Adding the first favorite to the cart.." + itemID);

    var addToLocalStorageArray = function(name, value) {

      // Get the existing data
      var existing = localStorage.getItem("productID");

      // If no existing data, create an array
      // Otherwise, convert the localStorage string to an array
      existing = existing ? existing.split(',') : [];

      // Add new data to localStorage Array
      existing.push(itemID);

      // Save back to localStorage
      localStorage.setItem("productID", existing.toString());

    };
    addToLocalStorageArray();
  });
  
  $(document).on("click", ".item2Button", function(e) {
    let itemID = $('#favoriteItemId2').text();
    console.log("Adding the first favorite to the cart.." + itemID);

    var addToLocalStorageArray = function(name, value) {

      // Get the existing data
      var existing = localStorage.getItem("productID");

      // If no existing data, create an array
      // Otherwise, convert the localStorage string to an array
      existing = existing ? existing.split(',') : [];

      // Add new data to localStorage Array
      existing.push(itemID);

      // Save back to localStorage
      localStorage.setItem("productID", existing.toString());

    };
    addToLocalStorageArray();
  });
  
  $(document).on("click", ".item3Button", function(e) {
    let itemID = $('#favoriteItemId3').text();
    console.log("Adding the first favorite to the cart.." + itemID);

    var addToLocalStorageArray = function(name, value) {

      // Get the existing data
      var existing = localStorage.getItem("productID");

      // If no existing data, create an array
      // Otherwise, convert the localStorage string to an array
      existing = existing ? existing.split(',') : [];

      // Add new data to localStorage Array
      existing.push(itemID);

      // Save back to localStorage
      localStorage.setItem("productID", existing.toString());

    };
    addToLocalStorageArray();
  });
  
  $(document).on("click", ".addCart", function(e) {
    e.preventDefault();
    //document.querySelector('tableInfo'), 
    //document.querySelector('cartContent tbody');
    console.log("Course added");
    let product, productInfo = null; //<--testing setting to null to see if the value can be reset..
    product = e.target;
    console.log("printing product: ", product);
    productInfo = {
      id: product.value,
      // image: product.querySelector('#productImage').alt,
      // title: product.querySelector('#productTitle').textContent,
      // price: product.querySelector('#productPrice').textContent
    };
    // console.log("Product info", productInfo);
    // insert productID into favorites here..
    // console.log("adding to favorites..");
    addFavorite(productInfo);
    var addToLocalStorageArray = function(name, value) {

      // Get the existing data
      var existing = localStorage.getItem("productID");

      // If no existing data, create an array
      // Otherwise, convert the localStorage string to an array
      existing = existing ? existing.split(',') : [];

      // Add new data to localStorage Array
      existing.push(productInfo.id);

      // Save back to localStorage
      localStorage.setItem("productID", existing.toString());

    };
    addToLocalStorageArray();
    // location.reload (); //reloads page...
    //console.log(localStorage.getItem("productID").length);
  });
  
  function addFavorite(productInformation){
    console.log("Adding "+ productInformation.id);
    $.ajax({
      method: "GET",
      url: "/api/addFavorite",
      dataType: "json",
      data: {
        "value": productInformation.id,
      },
      success: function(response) {
        console.log(response);
      }
    });
  }

  function displayCart() {
    var total = 0;
    if (localStorage.getItem('productID')) {
      let inCart = localStorage.getItem('productID').split(',');
      console.log(inCart);
      $("#cartContent").html(
        "<table id='cartItems'>" +
        "<tr>" +
        "<th>Picture</th>" +
        "<th>Name</th>" +
        "<th>Price</th>" +
        "</tr>"
      );
      inCart.forEach(function(item, i) {
        $.ajax({
          method: "GET",
          url: "/api/getProductID",
          dataType: "json",
          data: {
            "id": item,
          },
          success: function(response) {
            console.log("i :", i);
            console.log(response);
            console.log("Response item", response[0].make);
            $("#cartItems").append(
              '<tr>' +
              '<td><img src="' + response[0].pictureURL + '"width="100"></td>' +
              '<td>' + response[0].make + '</td>' +
              '<td>' + response[0].price + '</td>' +
              '</tr>'
            );
            total += response[0].price;
            console.log("total :", total);
            $("#cartItemsTotal").html(
              "<h3>Total Price $" + total.toFixed(2) + "</h3>"
            );
          }

        });
        //$("#cartContent").append(
        //  '<tr>' +
        //  '<td>' + item + '</td>' +
        //  '</tr>'
        //);
      });


    }
    else {
      $("#cartContent").html("Nothing in your cart");
    }

  }



  displayCart();
  $("#clearCart").on("click", function(e) {
    localStorage.clear();
    location.reload(true);
    // reset table displayed after new search
  });
});
