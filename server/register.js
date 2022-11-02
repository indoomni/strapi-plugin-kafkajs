'use strict';

const util = require('util');

// console.log('Kafka register..');

module.exports = ({ strapi }) => {
  if (!strapi.inspect)
    strapi.inspect = object =>
      util.inspect(object, {
        showHidden: false,
        depth: null,
        colors: true,
      });
};
