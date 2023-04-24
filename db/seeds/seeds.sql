-- Departments
INSERT INTO departments (name) VALUES ('Engineering');
INSERT INTO departments (name) VALUES ('Sales');
INSERT INTO departments (name) VALUES ('Finance');

-- Roles
INSERT INTO roles (title, salary, department_id) VALUES ('Software Engineer', 95000.00, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('QA Engineer', 75000.00, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('Sales Manager', 120000.00, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Sales Representative', 50000.00, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Accountant', 80000.00, 3);
INSERT INTO roles (title, salary, department_id) VALUES ('Financial Analyst', 100000.00, 3);

-- Employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Doe', 2, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Bob', 'Smith', 3, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Mary', 'Johnson', 4, 3);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Tom', 'Davis', 5, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Samantha', 'Lee', 6, 5);