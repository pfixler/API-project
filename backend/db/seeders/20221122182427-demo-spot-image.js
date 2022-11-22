'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "image.url",
        preview: false
      },
      {
        spotId: 2,
        url: "image.url",
        preview: false
      },
      {
        spotId: 3,
        url: "image.url",
        preview: false
      },
      {
        spotId: 4,
        url: "image.url",
        preview: false
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options);
  }
};
