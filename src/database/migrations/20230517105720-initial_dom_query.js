'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dom_query', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      price_query: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'query to reach DOM element',
      },
      stock_query: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'query to reach Stock DOM element',
      },
      stock_pattern: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'query to reach Pattern of stock',
      },
      query_type: {
        type: Sequelize.ENUM,
        allowNull: false,
        defaultValue: 'grouped',
        values: ['grouped', 'default'],
        comment: 'query type ',
      },

      configuration_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'configuration',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dom_query');
  },
};
