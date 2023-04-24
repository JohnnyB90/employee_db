const { prompt } = require('inquirer');
const db = require('./connection.js');

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

const addEmployee = async () => {
  try {
    const [roles, employees] = await Promise.all([
      getRoles(),
      db.query('SELECT * FROM employees'),
    ]);
  
      const { firstName, lastName, roleId, managerId } = await prompt([
        {
          type: 'input',
          name: 'firstName',
          message: 'Enter the first name of the employee:',
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'Enter the last name of the employee:',
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
  
      await db.query('INSERT INTO employees SET ?', employee);
      console.log(`Employee ${firstName} ${lastName} has been added.`);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  
  const updateEmployeeRole = async () => {
    const [employees, roles] = await Promise.all([
      db.query('SELECT * FROM employees'),
      db.query('SELECT * FROM roles'),
    ]);
  
    const { employee, role } = await prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Select the employee to update:',
        choices: employees.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id,
        })),
      },
      {
        type: 'list',
        name: 'role',
        message: 'Select the new role for the employee:',
        choices: roles.map(({ id, title }) => ({ name: title, value: id })),
      },
    ]);
  
    try {
      await db.query('UPDATE employees SET role_id = ? WHERE id = ?', [role, employee]);
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
    updateEmployeeRole,
    getDepartments,
    getRoles,
    getEmployees,
  };
  
  