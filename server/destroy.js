'use strict';

const util = require('util');

// console.log('Kafka destroy..');

module.exports = async ({ strapi }) => {
  const { publishers } = strapi.kafka;
  try {
    await publishers.forEach(async publisher => {
      await strapi
        .plugin('kafkajs')
        .controller('publisher')
        .deinit(publisher.clientId);
      strapi.log.debug(
        `Kafka publisher disconnected: ${util.inspect(
          publisher.clientId,
        )}`,
      );
    });
  } catch (err) {
    strapi.log.error(err);
  }
  strapi.log.info(
    `Destroyed publishers: ${util.inspect(publishers)}`,
  );

  const { subscribers } = strapi.kafka;
  try {
    await subscribers.forEach(async subscriber => {
      await strapi
        .plugin('kafkajs')
        .controller('subscriber')
        .deinit(subscriber.clientId);
      strapi.log.debug(
        `Kafka subscriber disconnected: ${util.inspect(
          subscriber.clientId,
        )}`,
      );
    });
  } catch (err) {
    strapi.log.error(err);
  }
  strapi.log.info(
    `Destroyed subscribers: ${util.inspect(subscribers)}`,
  );
};
