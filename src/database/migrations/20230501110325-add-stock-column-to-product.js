'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('product', 'in_stock', {
    type: Sequelize.BOOLEAN,
    allowNull: true, 
    defaultValue: false 
  });
  },

  async down (queryInterface, Sequelize) { 
    await queryInterface.removeColumn('product', 'in_stock');
  }
};
