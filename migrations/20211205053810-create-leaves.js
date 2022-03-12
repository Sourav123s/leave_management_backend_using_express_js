'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('leaves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      designation_id: {
        type: Sequelize.INTEGER
      },
      from_date: {
        type: Sequelize.DATE
      },
      to_date: {
        type: Sequelize.DATE
      },
      type_of_day: {
        type: Sequelize.STRING
      },
      leave_type: {
        type: Sequelize.STRING
      },
      reason: {
        type: Sequelize.TEXT
      },
      approved_date: {
        type: Sequelize.DATE
      },
      approved_date: {
        type: Sequelize.DATE
      },
      leave_status: {
        type: Sequelize.STRING
      },
      leave_apply_date: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('leaves');
  }
};