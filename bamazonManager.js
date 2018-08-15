var mysql    = require("mysql");
var inquirer = require("inquirer");
var Table    = require("easy-table");
require("dotenv").config();

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

var query = "SELECT * FROM products";
  
function managerStart() {
  connection.query(query, function(err, res) {
    if (err) throw err;

  inquirer
    .prompt([
      {
        type: "list",
        name: "mainList",
        message: "Hello Bamazon Manager, please make a selection:",
        choices: ["View Products for Sale", 
                  "View Low Inventory", 
                  "Add to Inventory",
                  "Add New Product"]
      },
      ]).then(function(answer) {
        console.log(answer.mainList);
        switch (answer.mainList) {
          case "View Products for Sale":
            viewProducts();
            break;
          case "View Low Inventory":
            lowInventory();
            break;
          case "Add to Inventory":
            addToInventory();
            break;
          case "Add New Product":
            addNewProduct();
            break;
        }
    });
  });
}

function viewProducts() {
  // If a manager selects `View Products for Sale`, the app should list every available item: 
  // the item IDs, names, prices, and quantities.
  var query = "SELECT * FROM products";
  connection.query(query, function(err, res){
    console.log(Table.print(res));
    managerStart();
  }
  )}

function lowInventory() {
  // If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
  var query = "SELECT * FROM products WHERE stock_quantity <= 2";
  connection.query(query, function(err, res) {
      if (err) throw err;
      console.log(Table.print(res));
    })
  
}

function addToInventory() {
  // If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" 
  // of any item currently in the store.
  var query = "SELECT * FROM products";
  connection.query(query, function(err, res){
    console.log(Table.print(res));
    
    inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the ID of the Product to add inventory: ",
        name: "product"
      },
      {
        type: "input",
        message:  "Enter how many to add: ",
        name: "quantity"
      },
      {
        // confirm if customer is ready to place order
        type: "confirm",
        message: "Confirm update?",
        name: "doIt"
      }
    ]).then(function(answer) {
      
    })
  }
  )

}

function addNewProduct() {
  // If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
  
}

// starts the app
managerStart();