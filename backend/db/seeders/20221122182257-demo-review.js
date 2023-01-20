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
        userId: 2,
        review: "This is a great property.This is a great property.This is a great property.This is a great property.",
        stars: 4
      },
      {
        spotId: 1,
        userId: 2,
        review: "This is a wonderful property.This is a wonderful property.This is a wonderful property.This is a wonderful property.",
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: "This is a bad property.This is a bad property.This is a bad property.This is a bad property.",
        stars: 2
      },
      {
        spotId: 3,
        userId: 1,
        review: "This is a terrible property.This is a great property.This is a great property.This is a great property.",
        stars: 1
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options);
  }
};
