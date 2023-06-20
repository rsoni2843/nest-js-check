'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.removeColumn('pricing_log', 'product_id');
    // await queryInterface.addColumn('pricing_log', 'index', {
    //   type: Sequelize.FLOAT,
    //   comment: 'competitor price / dentalkart price',
    // });
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.addColumn('pricing_log', 'product_id', {
    //   type: Sequelize.INTEGER.UNSIGNED,
    //   allowNull: false,
    //   references: {
    //     model: 'product',
    //     key: 'id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'CASCADE',
    // });
    // await queryInterface.removeColumn('pricing_log', 'index');
  },
};
