const { prompt } = require('inquirer');
const db = require('./connection.js');
const { updateEmployeeRolePrompt } = require('./utils/prompt.js');

const viewAllEmployees = async () => {
  const query = `
  SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.department_id = departments.id
  LEFT JOIN employees manager ON employees.manager_id = manager.id;
  `;

  try {
    const [rows, fields] = await db.query(query);
    console.table(rows);
  } catch (error) {
    console.error(error);
  }
};

const viewAllRoles = async () => {
  const query = `
    SELECT roles.id, roles.title, departments.name AS department, roles.salary
    FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id;
  `;
  try {
    const [rows, fields] = await db.query(query);
    console.table(rows);
  } catch (error) {
    console.error(error);
  }
};

const viewAllDepartments = async () => {
  const query = 'SELECT * FROM departments';
  try {
    const [rows, fields] = await db.query(query);
    console.table(rows);
  } catch (error) {
    console.error(error);
  }
};

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

const addRole = async (role) => {
  try {
    const [result] = await db.query('INSERT INTO roles SET ?', role);
    console.log(`Role "${role.title}" added successfully with ID ${result.insertId}.`);
  } catch (error) {
    console.error(error);
  }
};

const getRoles = async () => {
  const query = 'SELECT * FROM roles';
  try {
    const [rows, fields] = await db.query(query);
    console.log(rows);
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};


const getDepartments = async () => {
  const query = 'SELECT * FROM departments';
  try {
    const [rows, fields] = await db.query(query);
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getEmployees = async () => {
  const query = 'SELECT * FROM employees';
  try {
    const [rows, fields] = await db.query(query);
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const addEmployee = async (employee) => {
  try {
    await db.query('INSERT INTO employees SET ?', employee);
    console.log(`Employee ${employee.first_name} ${employee.last_name} has been added.`);
  } catch (error) {
    console.error(error);
  }
};



const addEmployeePrompt = async (roles, employees) => {
  const { firstName, lastName, roleId, managerId } = await prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the first name of the employee:',
      validate: (input) => {
        if (!input) {
          return 'Please enter a first name.';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the last name of the employee:',
      validate: (input) => {
        if (!input) {
          return 'Please enter a last name.';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the role for the employee:',
      choices: roles.map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
    {
      type: 'list',
      name: 'managerId',
      message: 'Select the manager for the employee (optional):',
      choices: employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    },
  ]);

  const employee = {
    first_name: firstName,
    last_name: lastName,
    role_id: roleId,
    manager_id: managerId || null,
  };
  

  await addEmployee(employee);
};

const updateEmployeeRole = async () => {
  try {
    const employees = await db.query('SELECT * FROM employees');
    const roles = await db.query('SELECT * FROM roles');
    console.log('Employees:', employees);
    console.log('Roles:', roles);

    const { employee_id, role_id } = await updateEmployeeRolePrompt(employees, roles);

    await db.query('UPDATE employees SET role_id = ? WHERE id = ?', [role_id, employee_id]);
    console.log(`Employee role updated successfully.`);
  } catch (error) {
    console.error(error);
  }
};



module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  addEmployeePrompt,
  updateEmployeeRole,
  getDepartments,
  getRoles,
  getEmployees,
};
