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
      message: "Enter how many to buy: ",
      name: "quantity"
    },
    {
      type: "confirm",
      message: "Confirm order?",
      name: "doIt"
    }
  ]).then(function(inq) {
    processOrder(inq.product, inq.quantity);
  })
})

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
          startApp();
        })
      } else {
        console.log("Insuffient Inventory, try again or contact a Bamazon Manager");
        startApp();
      }
    })
  }
}

startApp();