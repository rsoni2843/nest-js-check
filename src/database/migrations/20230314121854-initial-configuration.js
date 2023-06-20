'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('configuration', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'configuration ID',
      },
      price_dom_query: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'query to reach DOM element',
      },
      domain: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      base_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      jsRendering: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Whether or not JS rendering has to be used',
      },
      query_type: {
        type: Sequelize.ENUM,
        values: ['price', 'stock'],
        allowNull: false,
        comment: 'the query id used to fetch price/stock info',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('configuration');
  },
};
