'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_pricing_log', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      product_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'product',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
