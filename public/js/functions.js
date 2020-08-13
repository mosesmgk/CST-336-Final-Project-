/* global $ */
$(document).ready(function(){

let productToUpdate = "";
let isloaded = false;


$('#showProducts').on('click',function(){   
  var x = document.getElementById("products");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
   });
   
  $('#showAdmins').on('click',function(){   
  var x = document.getElementById("admins");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
   });

$('#showFavorites').on('click',function(){   
  var x = document.getElementById("favorites");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
   });
   
   $('#showInventory').on('click',function(){   
  var x = document.getElementById("inventory");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
   });
   
   
   $('.removeAdmin').on('click',function(){
       if(confirm("Are you sure you want to delete this record?")){
          alert("DatabaseUpdated");
          let adminID =(this).value;
          removeAdmin(adminID);
          window.location.href=window.location.href;
       }
   });
       
    $('.changeProduct').on('click', function() {
        productToUpdate= (this).value;
        getProductInfo(productToUpdate);
        var x = document.getElementById("updateProductFrom");
        x.style.display = "block";
        document.getElementById('updateProductFrom').scrollIntoView({behavior: "smooth"});
        
    })
    
    
    $('.removeFavorite').on('click',function(){
       if(confirm("Are you sure you want to delete this record?")){
          alert("DatabaseUpdated");
          let favoriteID =(this).value;
          //console.log(favoriteID);
          removeFavorite(favoriteID);
          window.location.href=window.location.href
       }
   });
    
    $('.removeProduct').on('click',function(){
       if(confirm("Are you sure you want to delete this record?")){
          alert("DatabaseUpdated");
          let productID =(this).value;
          //console.log(productID);
          removeProduct(productID);
          window.location.href=window.location.href
       }
   });
    
    
    $("#statistics").on('click', function(){
        var x = document.getElementById("staticsTables");
            if (x.style.display === "none") {
                x.style.display = "block";
            } else {
                x.style.display = "none";
            }
        if(!isloaded){
            stockByMan();
            priceByType();
            productsInStockByType();
        }
    })//onClick
    
    function productsInStockByType(){
        $.ajax({
            mehtod: "get",
            url: "/api/productsInStockByType",
            data:{
                
            },
            success: function(data, success){
                isloaded = true
                data.forEach(function(row){
                    $("#productsInStockByType").append("<tr><td>"+ row.productType +"</td><td>"+ row.total+"</td></tr>")
                })//forEach
            }//success
        })//ajax
    }
    
   function stockByMan(){
        $.ajax({
            mehtod: "get",
            url: "/api/stockByMan",
            data:{
                
            },
            success: function(data, success){
                isloaded = true
                data.forEach(function(row){
                    $("#stockByMan").append("<tr><td>"+ row.manufacturer +"</td><td>"+ row.stock+"</td></tr>")
                })//forEach
            }//success
        })//ajax
    }
    
    function priceByType(){
        $.ajax({
            mehtod: "get",
            url: "/api/priceByType",
            data:{
                
            },
            success: function(data, success){
                isloaded = true
                data.forEach(function(row){
                    $("#priceByType").append("<tr><td>"+ row.productType +"</td><td>$"+ row.priceTotal+"</td></tr>")
                })//forEach
            }//success
        })//ajax
    }
    
    function getProductInfo(value){
        $.ajax({
            mehtod: "get",
            url: "/api/getProductInfo",
            data: {
                "value":value
            },
            success: function(data, success){
                //console.log("succecc")
                data.forEach(function(row){
                    $("#make").val(row.make);
                    $("#model").val(row.model);
                    $("#manufacturer").val(row.manufacturer);
                    $("#type").val(row.type);
                    $("#price").val(row.price);
                    $("#description").val(row.description);
                    $("#pictureURL").val(row.pictureURL);
                })
               
            }
        })
    }
    
    
    function removeAdmin(value){
        $.ajax({
            method: "get",
            url: "/api/removeAdmin",
            data : {
                "value":value
            },
            success: function(data, satus){

            }
        });//ajax
       }
       

       
      
    function removeFavorite(value){
        $.ajax({
            method: "get",
            url: "/api/removeFavorite",
            data : {
                "value":value
            },
            success: function(data, satus){
            }
        });//ajax
       }
       

       
      
    function removeProduct(value){
        $.ajax({
            method: "get",
            url: "/api/removeProduct",
            data : {
                "value":value
            },
            success: function(data, satus){
            }
        });//ajax
       }
});