const { prompt } = require('inquirer');
const db = require('./connection.js');
const { updateEmployeeRolePrompt, updateEmployeeManagerPrompt, viewEmployeesByManagerPrompt, deleteRecordPrompt } = require('./utils/prompt.js');

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

// This will utilize the selected manager from the prompt function correlating to it and then display employees listed under that manager
const viewEmployeesByManager = async () => {
  try {
    const [managers] = await db.query(`
      SELECT employees.id, employees.first_name, employees.last_name
      FROM employees
      JOIN roles ON employees.role_id = roles.id
      WHERE title = "Manager"
    `);

    const { managerId } = await viewEmployeesByManagerPrompt(managers);

    const query = `
      SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employees
      LEFT JOIN roles ON employees.role_id = roles.id
      LEFT JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees manager ON employees.manager_id = manager.id
      WHERE employees.manager_id = ?
    `;
    const [rows] = await db.query(query, [managerId]);

    console.table(rows);
  } catch (error) {
    console.error(error);
  }
};

// This will utilize the selected department from the prompt function correlating to it and then display employees listed under that department
const viewEmployeesByDepartment = async () => {
  try {
    const [departments] = await db.query(`
      SELECT * FROM departments
    `);

    const choices = departments.map(({ id, name }) => ({
      name,
      value: id,
    }));

    const { departmentId } = await prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Select a department:",
        choices,
      },
    ]);

    const query = `
      SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary
      FROM employees
      LEFT JOIN roles ON employees.role_id = roles.id
      LEFT JOIN departments ON roles.department_id = departments.id
      WHERE departments.id = ?
    `;
    const [rows] = await db.query(query, [departmentId]);

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

// This is take the choice from the updateEmployeeRolePrompt and using it to update the database here.
const updateEmployeeRole = async () => {
  try {
    const [employees] = await db.query('SELECT * FROM employees');
    const [roles] = await db.query('SELECT * FROM roles');

    const { employee, role } = await updateEmployeeRolePrompt(employees, roles);
    await db.query('UPDATE employees SET role_id = ? WHERE id = ?', [role, employee]);
    console.log(`Employee role updated successfully.`);
  } catch (error) {
    console.error(error);
  }
};

// This is taking information from the employees database and awaiting for the updateEmployeeManagerPrompt function to complete and allow for the user to update the employees manager.
const updateEmployeeManager = async () => {
  try {
    const [employees] = await db.query('SELECT * FROM employees');
    const { employee, manager } = await updateEmployeeManagerPrompt(employees);
    await db.query('UPDATE employees SET manager_id = ? WHERE id = ?', [manager, employee]);
    console.log(`Employee manager updated successfully.`);
  } catch (error) {
    console.error(error);
  }
};

// This allows for deleting records in the database.
const deleteRecord = async (type) => {
  try {
    let result;
    let data;
    switch (type) {
      case 'department':
        const departments = await getDepartments();
        data = await deleteRecordPrompt(departments);
        console.log(data);
        if (data.recordId === null) return;
        const department = departments.find((dept) => dept.id === data.recordId);
        if (!department) {
          console.log(`Department with ID ${data.recordId} does not exist.`);
          return;
        }
        result = await db.query('DELETE FROM departments WHERE id = ?', [data.recordId]);
        console.log(`Successfully deleted department: ${department.name}.`);
        break;

      case 'role':
        const roles = await getRoles();
        data = await deleteRecordPrompt(roles);
        if (data.recordId === null) return;
        const role = roles.find((r) => r.id === data.recordId);
        if (!role) {
          console.log(`Role with ID ${data.recordId} does not exist.`);
          return;
        }
        result = await db.query('DELETE FROM roles WHERE id = ?', [data.recordId]);
        console.log(`Successfully deleted role: ${role.title}.`);
        break;

      case 'employee':
        const employees = await getEmployees();
        data = await deleteRecordPrompt(employees);
        if (data.recordId === null) return;
        const employee = employees.find((emp) => emp.id === data.recordId);
        if (!employee) {
          console.log(`Employee with ID ${data.recordId} does not exist.`);
          return;
        }
        result = await db.query('DELETE FROM employees WHERE id = ?', [data.recordId]);
        console.log(`Successfully deleted employee: ${employee.first_name} ${employee.last_name}.`);
        break;

      default:
        console.log(`Invalid type: ${type}. Please choose 'department', 'role', or 'employee'.`);
        return;
    }
  } catch (error) {
    console.error(error);
  }
};


// This is exporting the functions of the actions.js file to be used within the server.js file.
module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  viewEmployeesByManager,
  viewAllManagers,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  getDepartments,
  getRoles,
  getEmployees,
  updateEmployeeManager,
  viewEmployeesByDepartment,
  deleteRecord
};
