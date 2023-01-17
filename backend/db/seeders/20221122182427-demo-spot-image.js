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
        url: 'https://cdn.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://cdn.pixabay.com/photo/2014/11/21/17/17/house-540796_1280.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://cdn.pixabay.com/photo/2017/03/30/04/14/house-2187170_1280.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://cdn.pixabay.com/photo/2016/11/29/03/53/house-1867187_1280.jpg',
        preview: true
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options);
  }
};
