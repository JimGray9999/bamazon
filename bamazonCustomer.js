var mysql = require('mysql');
var inquirer = require("inquirer");
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
  startApp();
});

function startApp() {
  var query = "SELECT id, product_name, price FROM products";
  var showTheGoods = connection.query(query, function(err,data) {
      if (err) throw err;
      console.log("********************");
      console.log("*     BAMAZON!     *");
      console.log("********************");
      console.log("ID   | Product         | Price  ");
      console.log("----- ----------------- --------");
      for( i = 0 ; i < data.length ; i++){
        console.log(data[i].id + "     ", data[i].product_name + "   ", "$" + data[i].price);
      }
  })
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
    }
  ]).then(function(inq) {
    let query = "SELECT "
    connection.query(query, function(err, data) {

    })
  })
connection.end();
}



