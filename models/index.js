const sequelize = require('../lib/db');

const defineEmployee = require('./employee');
const defineProject = require('./project');
const defineTimeEntry = require('./timeEntry');

const Employee = defineEmployee(sequelize);
const Project = defineProject(sequelize);
const TimeEntry = defineTimeEntry(sequelize);

const db = {
  sequelize,
  Employee,
  Project,
  TimeEntry,
};

if (Employee.associate) Employee.associate(db);
if (Project.associate) Project.associate(db);
if (TimeEntry.associate) TimeEntry.associate(db);

module.exports = db;
