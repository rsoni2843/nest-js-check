'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      product_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      base_price: {
        type: Sequelize.FLOAT.UNSIGNED,
        allowNull: false,
      },
      product_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bar_code: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('product');
  },
};

//write a function that would delay for the provided time
// function delay(time){}

// function createCounter() {
//   let count = 0;

//   function increment() {
//     count++;
//     console.log(count);
//   }

//   function getCount() {
//     return count;
//   }

//   return { increment, getCount };
// }

// const counter = createCounter();
// counter.increment(); // 1
// counter.increment(); // 2
// console.log(counter.getCount()); // 2
