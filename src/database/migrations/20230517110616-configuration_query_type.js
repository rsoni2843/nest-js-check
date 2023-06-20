'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('configuration', 'query_type');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('configuration', 'query_type', {
      type: Sequelize.ENUM,
      values: ['price', 'stock'],
      allowNull: false,
      comment: 'the query id used to fetch price/stock info',
    });
  },
};
