'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('upload_log', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      uploaded_file: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      report_file: {
        type: Sequelize.STRING,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('upload_log');
  },
};
