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

-- Departments
INSERT INTO departments (name) VALUES ('Engineering');
INSERT INTO departments (name) VALUES ('Sales');
INSERT INTO departments (name) VALUES ('Finance');

-- Create roles table
DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE CASCADE
);

-- Roles
INSERT INTO roles (title, salary, department_id) VALUES ('Software Engineer', 95000.00, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('QA Engineer', 75000.00, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('Sales Manager', 120000.00, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Sales Representative', 50000.00, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Accountant', 80000.00, 3);
INSERT INTO roles (title, salary, department_id) VALUES ('Financial Analyst', 100000.00, 3);
INSERT INTO roles (title, salary, department_id) VALUES ('Manager', 175000.00, 3);

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

-- Employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Doe', 2, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Bob', 'Smith', 3, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Mary', 'Johnson', 4, 3);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Tom', 'Davis', 5, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Saman', 'Lee', 6, 5);


