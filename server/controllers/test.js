'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('kafkajs')
      .service('test')
      .doSomething('Welcome to Strapi 🚀');
  },
});
