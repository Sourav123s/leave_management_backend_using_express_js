"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class all_leave_statuses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ leaves }) {
      // define association here
    }
  }
  all_leave_statuses.init(
    {
      leave_id: DataTypes.INTEGER,
      approved_or_rejected_by: DataTypes.INTEGER,
      approve_or_rejected_date: DataTypes.DATE,
      leave_status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "all_leave_statuses",
    }
  );
  return all_leave_statuses;
};
