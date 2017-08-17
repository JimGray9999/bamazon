var mysql = require('mysql');
var inquirer = require("inquirer");
require('console.table');
require('dotenv').config();

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: 3306,

  // username to connect to db
  user: process.env.DB_USER,

  // password
  password: process.env.DB_PASS,
  database: "bamazon"
});

connection.connect(function(err){
  if (err) throw err;
  console.log("connected to : " + connection.threadId);
});

function startApp() {
  var query = "SELECT id, product_name, price FROM products";
  
  var showTheGoods = connection.query(query, function(err,data) {
      if (err) throw err;
      console.log("********************");
      console.log("*     BAMAZON!     *");
      console.log("********************");

      // prints out the table of products in a clean row
      // using the console.table npm package
      console.table(data);
  inquirer
  .prompt([
    {
      type: "input",
      message: "Enter the ID of the Product to Buy: ",
      name: "product"
    },
    {
      type: "input",
      message:  "Enter how many to buy: ",
      name: "quantity"
    },
    {
      // confirm if customer is ready to place order
      type: "confirm",
      message: "Confirm order?",
      name: "doIt"
    }
  ]).then(function(inq) {
    if (inq.doIt === true){
      processOrder(inq.product, inq.quantity); // place order
    } else {
      console.log("Returning to main menu...");
      startApp(); // returns to main menu
    }
  })
})

  // after customer confirms order, quantity is checked
  // order placed if quantity is available
  function processOrder(id, quantity) {
    let query = "SELECT id, product_name, price, stock_quantity FROM products WHERE ?"
    connection.query(query,{id: id}, function(err, data) {
      if (err) throw err;
      var cost = quantity * data[0].price;
      var productName = data[0].product_name;
      if(quantity <= data[0].stock_quantity){
        let query = "UPDATE products SET stock_quantity = stock_quantity - ?";
        query += " WHERE id = ?";
        connection.query(query,[quantity, id], function(err, data){
          
          console.log("Order Placed!");
          console.log("Purchased " + quantity + "  " + productName);
          console.log("Total Cost: " + "$" + cost);

          inquirer
          .prompt([
            {
              type: "confirm",
              message: "Place another order?",
              name: "nextOrder"
            }
          ]).then(function(inq) {
            if(inq.nextOrder === true){
              startApp(); // reload application after successful purchase
            } else {
              // close application if customer is finished
              console.log("Thank you for choosing Bamazon for your shopping needs!");
              
              // close connection to the database
              connection.end();
            }
          })
        })
      } else {
        // display message if not enough inventory
        console.log("Insuffient inventory, try again or contact a Bamazon Manager");
        startApp(); // returns to the main menu
      }
    })
  }
}

// launches main menu when file is opened
startApp();