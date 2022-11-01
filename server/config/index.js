'use strict';

const util = require('util');

console.log('Kafka config..');

module.exports = {
  default: ({ env }) => {
    if (
      !strapi.config.server.kafkajs ||
      !strapi.config.server.kafkajs.enabled
    ) {
      return undefined;
    }
    return strapi.config.server.kafkajs.config;
  },
  validator: config => {
    strapi.kafka = {
      publishers: [],
      subscribers: [],
    };

    // Publishers..
    try {
      const { publishers } = config;
      console.log('Publisher:', publishers);
      if (!publishers || publishers.length <= 0)
        throw new Error();
      publishers.forEach(publisher => {
        if (publisher.enabled) {
          if (
            typeof publisher.clientId !== 'string' &&
            typeof publisher.topic !== 'string' &&
            !publisher.brokers
          ) {
            throw new Error(
              `Kafka publisher ${util.inspect(
                publisher,
              )} configuration is invalid!`,
            );
          }
          strapi.kafka.publishers.push(publisher);
          console.log(
            `Kafka publisher ${util.inspect(
              publisher.clientId,
            )} configuration is valid!`,
          );
        }
      });
    } catch (err) {
      strapi.log.error(
        `Kafka publisher got disabled or configuration is invalid!`,
      );
    }

    // Subscribers..
    try {
      const { subscribers } = config;
      console.log('Subscribers:', subscribers);
      if (!subscribers || subscribers.length <= 0)
        throw new Error();
      subscribers.forEach(subscriber => {
        if (subscriber.enabled) {
          if (
            typeof subscriber.clientId !== 'string' &&
            typeof subscriber.topic !== 'string' &&
            !subscriber.brokers
          ) {
            throw new Error(
              `Kafka subscriber ${util.inspect(
                subscriber,
              )} configuration is invalid!`,
            );
          }
          strapi.kafka.subscribers.push(subscriber);
          console.log(
            `Kafka subscriber ${util.inspect(
              subscriber.clientId,
            )} configuration is valid!`,
          );
        }
      });
    } catch (err) {
      strapi.log.error(
        `Kafka subscriber got disabled or configuration is invalid!`,
      );
    }
  },
};
