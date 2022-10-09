'use strict';

const test = require('./test');
const publisher = require('./publisher');
const subscriber = require('./subscriber');

console.log('Kafka controllers..');

module.exports = {
  test,
  publisher,
  subscriber,
};
