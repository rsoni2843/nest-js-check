'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_competitor', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: `competitor's ID`,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `competitor's name`,
      },
      domain: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: `competitor's domain`,
      },
      competitor_url: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: `competitor's URL`,
      },
      price: {
        type: Sequelize.FLOAT.UNSIGNED,
        allowNull: false,
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_competitor');
  },
};
