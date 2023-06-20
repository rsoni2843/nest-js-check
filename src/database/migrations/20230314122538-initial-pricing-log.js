'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pricing_log', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      price_before: {
        type: Sequelize.FLOAT.UNSIGNED,
        allowNull: false,
        comment: 'price before updating',
      },
      price_after: {
        type: Sequelize.FLOAT.UNSIGNED,
        allowNull: false,
        comment: 'price after updating',
      },
      found_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      product_competitor_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'product_competitor',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      dom_query: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'query to reach DOM element',
      },
      index: {
        type: Sequelize.FLOAT,
        comment: 'competitor price / dentalkart price',
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['success', 'failure'],
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pricing_log');
  },
};
