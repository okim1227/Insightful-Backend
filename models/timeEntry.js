const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TimeEntry = sequelize.define('TimeEntry', {
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });

  return TimeEntry;
};