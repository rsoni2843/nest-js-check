'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('configuration', 'stock_pattern', {
      type: Sequelize.TEXT,
    });

    await queryInterface.addColumn('configuration', 'stock_dom_query', {
      type: Sequelize.TEXT,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('configuration', 'stock_pattern');
    await queryInterface.removeColumn('configuration', 'stock_dom_query');
  }
};
