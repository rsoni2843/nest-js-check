'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('report_files', {
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
      report_file: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      filter_options: {
        type: Sequelize.JSON,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('report_files');
  },
};
