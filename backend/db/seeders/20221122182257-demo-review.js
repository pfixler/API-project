'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        review: "great",
        stars: 4
      },
      {
        spotId: 1,
        userId: 2,
        review: "wonderful",
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: "bad",
        stars: 2
      },
      {
        spotId: 3,
        userId: 3,
        review: "terrible",
        stars: 1
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options);
  }
};
