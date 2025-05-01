const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Employee = sequelize.define('Employee', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        }, {
        freezeTableName: true
    });

    Employee.associate = (models) => {
        Employee.belongsToMany(models.Project, {
          through: 'EmployeeProjects',
          foreignKey: 'employeeId',
          otherKey: 'projectId'
        });
      };

  return Employee;
};
