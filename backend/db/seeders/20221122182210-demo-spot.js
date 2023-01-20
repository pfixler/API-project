'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '1 apple street',
        city: 'Cincinnati',
        state: 'Ohio',
        country: 'USA',
        lat: 39.103119,
        lng: -84.512016,
        name: '1apple',
        description: 'This is a house at 1 apple street.This is a house at 1 apple street.This is a house at 1 apple street.',
        price: 100
      },
      {
        ownerId: 1,
        address: '1 pear street',
        city: 'Cincinnati',
        state: 'Ohio',
        country: 'USA',
        lat: 39.103119,
        lng: -84.512016,
        name: '1pear',
        description: 'This is a house at 1 pear street.This is a house at 1 pear street.This is a house at 1 pear street.',
        price: 200
      },
      {
        ownerId: 2,
        address: '2 banana street',
        city: 'Cincinnati',
        state: 'Ohio',
        country: 'USA',
        lat: 39.103119,
        lng: -84.512016,
        name: '2banana',
        description: 'This is a house at 2 banana street.This is a house at 2 banana street.This is a house at 2 banana street.',
        price: 250
      },
      {
        ownerId: 3,
        address: '5 plum street',
        city: 'Cincinnati',
        state: 'Ohio',
        country: 'USA',
        lat: 39.103119,
        lng: -84.512016,
        name: '5plum',
        description: 'This is a house at 5 plum street.This is a house at 5 plum street.This is a house at 5 plum street.',
        price: 500
      }
    ]);

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options);
  }
};
