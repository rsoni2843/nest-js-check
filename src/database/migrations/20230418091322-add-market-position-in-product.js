'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('product', 'market_position', {
      type: Sequelize.ENUM(
        'cheapest',
        'average',
        'costlier',
        'cheaper',
        'costliest',
      ),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('product', 'market_position');
  },
};
