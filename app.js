//Constant vairables to use all installed Nodes
const express = require("express");
const app = express();
const request = require("request");
const session = require('express-session');
const pool = require("./dbPool.js");
const bcrypt = require('bcrypt');
var loggedUser= "";
const saltRounds = 10;


//Express use and set declarations
app.set("view engine" , "ejs");

app.use(express.static("public"));

app.use(session({
    secret: "top secret!",
    resave: true,
    saveUninitialized: true
}));

app.use(express.urlencoded({extended: true}));

//ROUTES

// Home page
app.get("/", function(req, res){
    res.render("index");
    // console.log("Opening root..");
});

//Admin Login Get Route
app.get("/login", function(req, res){
    res.render("login");
});

app.get("/catalog", function(req, res){
    res.render("catalog");
});

app.get("/cart", function(req, res){
    res.render("cart");
});

//Admin login POST check route
app.post("/login", async function(req,res){
    let username = req.body.username;
    let password = req.body.password;

    let result = await checkUsername(username);
    console.dir(result);
    let hashedPwd = "";

    if(result.length > 0){
        hashedPwd=result[0].password;
    }

    let passwordMatch = await checkPassword(password, hashedPwd);
    console.log("passwordMatch: " + passwordMatch);

    if (passwordMatch){
        req.session.authenticated = true;
        loggedUser = username;
       res.redirect("/adminpage");
    } else {
        res.render("login", {"loginError":true});
    }
});

//Admin Logout route
app.get("/logout", function(req, res){
    req.session.destroy();
    res.redirect("/login");
});

//Admin page route
app.get("/adminpage", isAuthenticated, function(req,res){

    let username = loggedUser;
    let sql = "SELECT * FROM product";
    let sql2 = "SELECT * FROM admin";
    let sql3 = "SELECT product.id, product.make FROM favorites JOIN product WHERE product.id = favorites.product_id";
    let sql4 = "SELECT product.id, product.make, Inventory.quantity FROM Inventory JOIN product WHERE product.id = Inventory.product_id ORDER BY product.id";
    pool.query(sql, function (err, rows) {
        if (err) throw err;
        //console.log(rows);
        pool.query(sql2, function (err, rows2) {
            if (err) throw err;
            //console.log(rows2);
            pool.query(sql3, function (err, rows3){
                if (err) throw err;
                pool.query(sql4, function(err, rows4) {
                if (err) throw err;
                //console.log(rows3);
                res.render("adminpage" , {"rows":rows,"rows2":rows2, "rows3":rows3,"rows4":rows4,"username": username});
                });
            });
        });
    });
});


//route to page to add admin
app.get("/addAdmin", isAuthenticated, function(req, res) {
  res.render("addAdmin");
});

//route to page to add product
app.get("/addProduct", isAuthenticated, function(req, res) {
  res.render("addProduct");
});


//////////////////////////// API ACCESS ///////////////////////////////////////

//get ENTIRE list of favorites
app.get("/api/getFavorites", function(req, res){
  let sql = "SELECT * FROM product INNER JOIN favorites ON product.id = favorites.product_id;";
  pool.query(sql, function (err, rows) {
    if (err) throw err;
    res.send(rows);
  });
  
});//api/getFavorites

//product information from database
app.get("/api/getProductInfo" , isAuthenticated,function(req, res) {
    let username = loggedUser;
    let productID = [req.query.value];
    let sql ="SELECT * from product WHERE id = ?";
    pool.query(sql, productID, function(err, rows, fields) {
        if(err) throw err;
        //console.log(rows);
        res.send(rows);
    });
});//product information


//API TO RETRIEVE ALL INFO FROM DB
app.get("/api/getAllProduct" , function(req, res) {
    let query = "SELECT * from product";
    let params = [];
    //let paramSql = [req.query.make, req.query.manufacturer, req.query.partType];
    let make = req.query.make;
    let partType = req.query.partType;
    let manufacturer = req.query.manufacturer;
    if (partType) {
      params.push("type LIKE '%".concat(partType) + "%'");
    }
    if (manufacturer) {
      params.push("manufacturer LIKE '%".concat(manufacturer) + "%'");
    }
    if (make) {
      params.push("make LIKE '%".concat(make) + "%'");
    }
    if (params.length > 0) {
      query = query.concat(" WHERE ", params.join(" AND "));
    }
    // console.log("query is: ", query);
    pool.query(query, function(err, rows, fields) {
        if (err) err;
        // console.log("Rows: ", rows);
        res.send(rows);
    });
});
//END OF API TO RETRIEVE ALL INFO FROM DB

//API to RETRIEVE ID
app.get("/api/getProductID", function(req, res){
    let sql = "SELECT make, pictureURL, price FROM product WHERE id = ?";
    let sqlParam = [req.query.id];
    //let sqlParam = 1;
    // console.log("SqlParams: ", sqlParam);
    pool.query(sql, sqlParam, function (err, rows, fields) {
        if (err) throw err;
        // console.log("rows :", rows);
        res.send(rows);
     });
});
//API to RETRIEVE ID


/////DATABASE SET & UPDATE ROUTES/////

//API to remove admin data from database
app.get("/api/removeAdmin", function(req, res) {
    let sql = "DELETE FROM admin WHERE id = ?";
    let sqlParam = [req.query.value];
    pool.query(sql, sqlParam, function (err, rows, fields) {
        if (err) throw err;
        //console.log(rows);
     });
});


//API to remove favorites data from database
app.get("/api/removeFavorite", function(req, res) {
    let sql = "DELETE FROM favorites WHERE product_id = ?";
    let sqlParam = [req.query.value];
    pool.query(sql, sqlParam, function (err, rows, fields) {
        if (err) throw err;
        //console.log(rows);
     });
}); //remove favorite

//API to add favorites data from database
app.get("/api/addFavorite", function(req, res) {
    let sql = "INSERT INTO favorites(product_id) VALUES (?)";
    let sqlParam = [req.query.value];
    // console.log("SQL: "+sql+" PARAMS: "+sqlParam);
    pool.query(sql, sqlParam, function (err, rows, fields) {
        if (err) throw err;
        // console.log(rows);
     });
}); //add favorite

//API to remove product from database
app.get("/api/removeProduct", function(req, res) {
    let sql2 = "DELETE FROM product WHERE id = ?";
    let sqlParam = [req.query.value];
    let sql = "DELETE FROM Inventory WHERE product_id = ?";
    pool.query(sql, sqlParam, function (err, rows, fields) {
        if (err) throw err;
        pool.query(sql2, sqlParam, function(err, rows, fields) {
            if(err) throw err;
            //console.log(rows);
        });
     });
});

//API to update selected product
app.get("/api/updateProducts", isAuthenticated, function(req, res) {
    let sql = "UPDATE product SET make = ?, model = ?, manufacturer = ?, type = ?, price = ?, description = ?, pictureURL = ? WHERE make = ?";
    let sqlParam = [req.query.make, req.query.model, req.query.manufacturer, req.query.type, req.query.price, req.query.description, req.query.pictureURL, req.query.make];
    console.log(sqlParam);
    pool.query(sql, sqlParam, function (err, rows, fields) {
        if (err) throw err;
        //console.log(rows);
        res.render("tableUpdated");
     });
});

//API to INSERT admins table
app.get("/api/updateAdmins", async function(req, res){
    let plainPw = req.query.password;
    let hashedPwd = await hashPwd(plainPw);
    //console.log(hashedPwd);
    let sql = "INSERT INTO admin (username, password) VALUES (?,?)";
    let sqlParams = [req.query.username, hashedPwd];
    pool.query(sql, sqlParams, function (err, rows, fields) {
      if(err){  //we make sure theres an error (error obj)
        if(err.errno==1062){
            return res.render('addAdmin',{"loginError":true});
            }
        else{
            throw err;
            }
      }
      //console.log(rows);
      res.render("tableUpdated");
    });
});//api/updateAdmins


//API to INSERT product table
app.get("/api/addProducts", function(req, res){
    let sql = "INSERT INTO product (make, model, manufacturer, type, price, description, pictureURL) VALUES (?,?,?,?,?,?,?)";
    let sqlParams = [req.query.make, req.query.model, req.query.manufacture, req.query.type, req.query.price, req.query.description, req.query.pictureURL];
    let getID = "SELECT id from product ORDER BY id DESC LIMIT 1;";
    let quantity = req.query.quantity;
    let sql2 = "INSERT INTO Inventory(product_id, quantity) VALUES (?,?)";
    pool.query(sql, sqlParams, function (err, rows, fields) {
        if(err){
            if(err.errno==1062){
                return res.render('addProduct',{"loginError":true});
                }
            else{
                throw err;
                }
          }
            //console.log(rows);
            pool.query(getID, function(err, rows, fields){
                if (err) throw err;
                let sqlParams2 =[rows[0].id,quantity];
                pool.query(sql2, sqlParams2, function(err, rows, fields) {
                    if (err) throw err;
                     res.render("tableUpdated");
                });

          });
      });
});//api/updateProducts

//API to UPDATE data to Inventory table
app.get("/api/updateInventory", function(req, res){
  let sql;
  let sqlParams;
  sql = "UPDATE Inventory SET quantity = ? WHERE product_id = ?";
  sqlParams = [ req.query.quantity,req.query.product_id];

  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    //console.log(rows);
    res.render("tableUpdated");
  });
});//api/updateInventory


//APIs TO SHOW STATISTICS

//Show Stock by Manufacturer
app.get("/api/stockByMan", function(req, res){
    let sql = "SELECT   product.manufacturer AS 'manufacturer' , COUNT(*) AS 'stock' FROM product GROUP BY product.manufacturer";
    pool.query(sql, function(err, rows, fields) {
        if (err) throw err;
        //console.log(rows)
        res.send(rows);
    });
});


//Show Value by type in Stock
app.get("/api/priceByType", function(req, res){
    let sql = "SELECT  product.type AS 'productType', SUM(product.price)*Inventory.quantity AS 'priceTotal' FROM product JOIN Inventory ON product.id = Inventory.product_id GROUP BY product.type ";
    pool.query(sql, function(err, rows, fields) {
        if (err) throw err;
        //console.log(rows)
        res.send(rows);
    });
});

//Show product in stock by Type
app.get("/api/productsInStockByType", function(req, res){
    let sql = "SELECT  product.type AS 'productType', SUM(Inventory.quantity) AS 'total' FROM product JOIN Inventory ON product.id = Inventory.product_id GROUP BY product.type  ";
    pool.query(sql, function(err, rows, fields) {
        if (err) throw err;
        //console.log(rows)
        res.send(rows);
    });
});

//start server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running...");
});


/////SERVER SIDE FUNCTIONS//////

//compares password entered to given hashed value
 function checkPassword(password, hashedValue){
     return new Promise( function(resolve, reject){

         bcrypt.compare(password, hashedValue, function(err,res){
             if (err) throw err;
             //console.log("Result: "+ res);
             resolve(res);
         });
     });
 }


//hashes given password
function hashPwd(plainPw){

    return new Promise(function(resolve,reject){
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(plainPw, salt);
        //console.log(hash)
        resolve(hash);
    });
}

//Checks if admin is logged in if not loads login page
function isAuthenticated(req,res,next){
    if(!req.session.authenticated){
        res.redirect('login');
    } else {
        next();
    }
}


//Checks if given variable exissts in database
 function checkUsername(username){
     let sql = "SELECT * FROM admin WHERE username = ?";
     return new Promise(function(resolve, reject){
             pool.query(sql,[username], function(err, rows,fields){
                 if(err) throw err;
                 //console.log("Rows found: " + rows.length);
                 resolve(rows);
             });//query
     });//promise
 }



//THESE GETS WERE USED TO DISPLAY ALL DATABASE INFO TODO -> REMOVE
/**
app.get("/search",  function(req, res) {
  let sql = "SELECT * FROM product";
  pool.query(sql, function (err, rows, fields) {
     if (err) throw err;
     console.log(rows);
     res.render("adminpage" , {"rows":rows});
  });
});//search

app.get("/admins",  function(req, res) {
  let sql = "SELECT * FROM admin";
  pool.query(sql, function (err, rows, fields) {
     if (err) throw err;
     console.log(rows);
     res.render("admins" , {"rows":rows});
  });
});//search

app.get("/inventory",  function(req, res) {
  let sql = "SELECT product.make, Inventory.quantity FROM Inventory JOIN product WHERE product.id = Inventory.product_id";
  pool.query(sql, function (err, rows, fields) {
     if (err) throw err;
     console.log(rows);
     res.render("inventory" , {"rows":rows});
  });
});//search
**/