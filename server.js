// This is allowing the tables within sql to be displayed as a table to the terminal when returned.
require("console.table");
// Importing the inquirer tool
const { prompt } = require("inquirer");
// This is importing the exported functions from the actions.js file.
const {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  viewAllManagers,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  getDepartments,
  getRoles,
  getEmployees,
} = require("./actions");
// Importing the "adds" from the prompt.js file.
const { addRolePrompt, addEmployeePrompt } = require("./utils/prompt");

// This is running the prompt for the questions in order to initiate the appropriate function.
const start = async () => {
  console.log("Welcome to Employee Management System!");
  const { action } = await prompt({
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      { name: "View all departments", value: "VIEW_DEPARTMENTS" },
      { name: "View all roles", value: "VIEW_ROLES" },
      { name: "View all employees", value: "VIEW_EMPLOYEES" },
      { name: "View all managers", value: "VIEW_MANAGERS"},
      { name: "Add a department", value: "ADD_DEPARTMENT" },
      { name: "Add a role", value: "ADD_ROLE" },
      { name: "Add an employee", value: "ADD_EMPLOYEE" },
      { name: "Update an employee role", value: "UPDATE_EMPLOYEE_ROLE" },
      { name: "Exit", value: "EXIT" },
    ],
  });

  // Switch is checking the value of the action variable and running a function based on the value matching the choice.
  switch (action) {
    case "VIEW_DEPARTMENTS":
      await viewAllDepartments();
      break;
    case "VIEW_ROLES":
      await viewAllRoles();
      break;
    case "VIEW_EMPLOYEES":
      await viewAllEmployees();
      break;
    case "VIEW_MANAGERS":
      await viewAllManagers();
      break;
    case "ADD_DEPARTMENT":
      await addDepartment();
      break;
    case "ADD_ROLE":
      const departments = await getDepartments();
      const newRole = await addRolePrompt(departments);
      await addRole(newRole);
      break;
    case "ADD_EMPLOYEE":
      const roles = await getRoles();
      const employees = await getEmployees();
      const newEmployee = await addEmployeePrompt(roles, employees);
      await addEmployee(newEmployee);
      break;
    case "UPDATE_EMPLOYEE_ROLE":
      await updateEmployeeRole();
      break;
    case "EXIT":
      console.log("Goodbye!");
      process.exit();
    default:
      console.error("Invalid action:", action);
      break;
  }
  // Start is being called recursively here, meaning it will go back to the menu after the choice is made and questions completed.
  start();
};
start();
