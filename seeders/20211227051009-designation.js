"use strict";

const data = require("./data/designation");

const Designation = require("../models").designations;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Designation.bulkCreate(data);
  },

  down: async (queryInterface, Sequelize) => {
    await Designation.destroy({ truncate: { cascade: true } });
  },
};
