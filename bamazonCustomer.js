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
console.log("********************");
console.log("*     BAMAZON!     *");
console.log("********************");
inquirer
.prompt([
  {
    // display list of items from the products table
  }
])
}



