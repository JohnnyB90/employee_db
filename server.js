// This is allowing the tables within sql to be displayed as a table to the terminal when returned.
require("console.table");
// Importing the inquirer tool
const { prompt } = require("inquirer");
// This is importing the exported functions from the actions.js file.
const {
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
  deleteRecord,
} = require("./actions");
// Importing the "adds" from the prompt.js file.
const {
  addRolePrompt,
  addEmployeePrompt,
  deleteRecordPrompt,
} = require("./utils/prompt");

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
      { name: "View all managers", value: "VIEW_MANAGERS" },
      { name: "View employees by manager", value: "VIEW_EMPLOYEES_BY_MANAGER" },
      {
        name: "View employees by department",
        value: "VIEW_EMPLOYEES_BY_DEPARTMENT",
      },
      { name: "Add a department", value: "ADD_DEPARTMENT" },
      { name: "Add a role", value: "ADD_ROLE" },
      { name: "Add an employee", value: "ADD_EMPLOYEE" },
      { name: "Update an employee role", value: "UPDATE_EMPLOYEE_ROLE" },
      { name: "Update an employee manager", value: "UPDATE_EMPLOYEE_MANAGER" },
      { name: "Delete a record", value: "DELETE" },
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
    case "VIEW_EMPLOYEES_BY_MANAGER":
      await viewEmployeesByManager();
      break;
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      await viewEmployeesByDepartment();
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
    case "UPDATE_EMPLOYEE_MANAGER":
      await updateEmployeeManager();
      break;
    case "DELETE":
      const { recordType } = await deleteRecordPrompt();
      switch (recordType) {
        case "DELETE_DEPARTMENT":
          await deleteRecord("department");
          break;
        case "DELETE_ROLE":
          await deleteRecord("role");
          break;
        case "DELETE_EMPLOYEE":
          await deleteRecord("employee");
          break;
        default:
          console.error("Invalid record type:", recordType);
          break;
      }
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
