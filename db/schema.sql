-- Create employees_db database
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;


-- Use employees_db database
USE employees_db;

-- Create departments table
DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);

-- Create roles table
DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE CASCADE
);

-- Create employees table
DROP TABLE IF EXISTS employees;
CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employees (id) ON DELETE SET NULL
);