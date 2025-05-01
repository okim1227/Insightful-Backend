const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
    name: { type: DataTypes.STRING, allowNull: false },
    screenshot_interval_sec: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 300 },
  }, {
    tableName: 'project',
  });

  Project.associate = (models) => {
    Project.belongsToMany(models.Employee, {
      through: 'EmployeeProjects',
      foreignKey: 'projectId',
      otherKey: 'employeeId'
    });
  };

  return Project;
};
