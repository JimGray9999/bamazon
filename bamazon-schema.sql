-- Drops the bamazon database if already exists --
DROP DATABASE IF EXISTS bamazon;

-- Create a database called bamazon --
CREATE DATABASE bamazon;

-- make sure in bamazon database before creating tables --
use bamazon;

-- create the table products --
CREATE TABLE products(
  -- auto increment the primary id key
  id INT(1) NOT NULL,
  product_name CHAR(30),
  department_name CHAR(30),
  price DOUBLE(7,2),
  stock_quantity INT(5),
  primary key(id)
);