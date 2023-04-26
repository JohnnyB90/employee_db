const { prompt } = require('inquirer');
const db = require('./connection.js');
const { updateEmployeeRolePrompt } = require('./utils/prompt.js');

// This allows to view all employees by selecting them from the sql database once schema and seeds are sourced, schema must be sourced, seeds does not have to if your adding your own.
const viewAllEmployees = async () => {
  const query = `
  SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.department_id = departments.id
  LEFT JOIN employees manager ON employees.manager_id = manager.id;
  `;

  try {
    const [rows] = await db.query(query);
    console.table(rows);
  } catch (error) {
    console.error(error);
  }
};
// This allows to view all managers by selecting them from the sql database by identifying them if they have a Manager string under title once schema and seeds are sourced, schema must be sourced, seeds does not have to if your adding your own.
const viewAllManagers = async () => {
  const query = `
    SELECT employees.id, employees.first_name, employees.last_name
    FROM employees
    JOIN roles ON employees.role_id = roles.id
    WHERE title = "Manager"
  `;

  try {
    const [rows] = await db.query(query);
    console.table(rows);
  } catch (error) {
    console.error(error);
  }
};

// This allows to view all roles by selecting them from the sql database once schema and seeds are sourced, schema must be sourced, seeds does not have to if your adding your own.
const viewAllRoles = async () => {
  const query = `
    SELECT roles.id, roles.title, departments.name AS department, roles.salary
    FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id;
  `;
  try {
    const [rows] = await db.query(query);
    console.table(rows);
  } catch (error) {
    console.error(error);
  }
};
// This allow to view all departments by selecting them from the sql database once schema and seeds are sourced, schema must be sourced, seeds does not have to if your adding your own.
const viewAllDepartments = async () => {
  const query = 'SELECT * FROM departments';
  try {
    const [rows] = await db.query(query);
    console.table(rows);
  } catch (error) {
    console.error(error);
  }
};

// This will add a department by essentially deconstructing the anwsers from the prompt addDepartment and then doing a try to insert into database set name for department. The question mark acts as a placeholder to prevent sql injection.
const addDepartment = async () => {
  const { name } = await prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
      validate: (input) => {
        if (!input) {
          return 'Please enter a department name.';
        }
        return true;
      },
    },
  ]);
  try {
    await db.query('INSERT INTO departments SET ?', { name });
    console.log(`Department "${name}" added successfully.`);
  } catch (error) {
    console.error(error);
  }
};
// This will add a role by essentially deconstructing the anwsers from the prompt role and then doing a try to insert into database set name for department. The question mark acts as a placeholder to prevent sql injection. 
const addRole = async (role) => {
  try {
    const [result] = await db.query('INSERT INTO roles SET ?', role);
    console.log(`Role "${role.title}" added successfully with ID ${result.insertId}.`);
  } catch (error) {
    console.error(error);
  }
};

// This is a simple grab data from the roles table, return the roles
const getRoles = async () => {
  const query = 'SELECT * FROM roles';
  try {
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// This is a simple grab data from the departments table, return the roles
const getDepartments = async () => {
  const query = 'SELECT * FROM departments';
  try {
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};
// This is a simple grab data from the employees table, return the employees
const getEmployees = async () => {
  const query = 'SELECT * FROM employees';
  try {
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};


// This is the action to add the employee, It 
const addEmployee = async (employee) => {
  try {
    await db.query('INSERT INTO employees SET ?', employee);
    console.log(`Employee ${employee.first_name} ${employee.last_name} has been added.`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  viewAllManagers,
  addDepartment,
  addRole,
  addEmployee,
  // addEmployeePrompt,
  // updateEmployeeRole,
  getDepartments,
  getRoles,
  getEmployees,
};
