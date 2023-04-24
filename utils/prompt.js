const inquirer = require('inquirer');

// Main menu prompt
const mainPrompt = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    },
  ]);
};

// Add department prompt
const addDepartmentPrompt = () => {
  return inquirer.prompt([
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
};

// Add role prompt
const addRolePrompt = (departments) => {
  const departmentChoices = departments.map((department) => ({
    name: department.name,
    value: department.id,
  }));

  return inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the role:',
      validate: (input) => {
        if (!input) {
          return 'Please enter a role title.';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary for the role:',
      validate: (input) => {
        if (!input || isNaN(input)) {
          return 'Please enter a valid salary.';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'Select the department for the role:',
      choices: departmentChoices,
    },
  ]);
};

// Add employee prompt
const addEmployeePrompt = (roles, employees) => {
  const roleChoices = roles.map((role) => ({
    name: role.title,
    value: role.id,
  }));

  const managerChoices = employees.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));

  managerChoices.unshift({ name: 'None', value: null });

  return inquirer.prompt([
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
      name: 'last_name',
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
      name: 'role_id',
      message: 'Select the role for the employee:',
      choices: roleChoices,
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Select the manager for the employee (optional):',
      choices: managerChoices,
      default: 'None',
    },
  ]).then(answers => {
    // Map the 'firstName' key to 'first_name'
    answers.first_name = answers.firstName;
    delete answers.firstName;

    return answers;
  });
};


// Update employee role prompt
const updateEmployeeRolePrompt = (employees, roles) => {
  const employeeChoices = employees.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));

  const roleChoices = roles.map((role) => ({
    name: role.title,
    value: role.id,
  }));

  return inquirer.prompt([
    {
      type: 'list',
      name: 'employee',
      message: 'Select the employee to update:',
      choices: employeeChoices,
    },
    {
      type: 'list',
      name: 'role',
      message: 'Select the new role for the employee:',
      choices: roleChoices,
    },
  ]);
};


module.exports = {
  mainPrompt,
  addDepartmentPrompt,
  addRolePrompt,
  addEmployeePrompt,
  updateEmployeeRolePrompt,
};