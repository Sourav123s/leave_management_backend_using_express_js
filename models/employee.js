"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ designations }) {
      // define association here
      this.belongsTo(designations, { foreignKey: "designation_id" });
    }
  }
  employee.init(
    {
      emp_id: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      mobile_no: DataTypes.INTEGER,
      password: DataTypes.STRING,
      no_of_sick_leaves: DataTypes.STRING,
      no_of_casual_leaves: DataTypes.STRING,
      designation_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "employee",
    }
  );
  return employee;
};
