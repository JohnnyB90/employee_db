// This is importing the inquirer tool
const inquirer = require('inquirer');

// Add department prompt will begin questions about the adding department
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

// This will begin questions about viewing employees by manager
const viewEmployeesByManagerPrompt = async (managers) => {
  const choices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));

  const { managerId } = await inquirer.prompt([
    {
      type: "list",
      name: "managerId",
      message: "Select a manager:",
      choices,
    },
  ]);

  return { managerId };
};

// Add role prompt will begin questions about adding roles
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

// Add employee prompt will begin questions about add employee
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
    answers.first_name = answers.firstName;
    delete answers.firstName;

    return answers;
  });
};

// updateEmployeeRolePrompt will begin questions about updateEmployeeRoles
const updateEmployeeRolePrompt = (employees, roles) => {
  // This will create a new array with a for loop using the map method of the current list of employees that exists and store it into a variable called employeeChoices
  const employeeChoices = employees.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
// This will create a new array with a for loop using the map method of the current list of roles that exists and store it into a variable called roleChoices
  const roleChoices = roles.map((role) => ({
    name: role.title,
    value: role.id,
  }));
  // This will then create questions about the employee and role you wish to update
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

// This will allow updating the employee's manager by taking in a list of employee's and managers in the system and creating a new array using the map method. Once that is done it will be displayed to the user to select which employee they would like to update and then those anwsers will be carried over to the actions.js file to be used.
const updateEmployeeManagerPrompt = async (employees) => {
  const employeeChoices = employees.map((e) => ({
    name: `${e.first_name} ${e.last_name}`,
    value: e.id,
  }));

  const managerChoices = [
    { name: "None", value: null },
    ...employeeChoices,
  ];

  const questions = [
    {
      type: "list",
      name: "employee",
      message: 'Select an employee to update their manager:',
      choices: employeeChoices,
    },
    {
      type: "list",
      name: "manager",
      message: 'Select a new manager for the employee:',
      choices: managerChoices,
    },
  ];

  return inquirer.prompt(questions);
};
// This is exporting all of the functions to be used in another file
module.exports = {
  addDepartmentPrompt,
  addRolePrompt,
  addEmployeePrompt,
  updateEmployeeRolePrompt,
  updateEmployeeManagerPrompt,
  viewEmployeesByManagerPrompt,
};