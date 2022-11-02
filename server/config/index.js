'use strict';

// console.log('Kafka config..');
// console.log('Config ->', strapi.config.server.kafkajs);

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
    const { publishers } = config;
    // console.log('Publishers:', publishers);
    publishers.forEach(publisher => {
      const {
        enabled,
        clientId,
        topic,
        brokers,
      } = publisher;
      try {
        if (enabled) {
          if (
            typeof clientId === 'string' &&
            typeof topic === 'string' &&
            brokers.length > 0
          ) {
            strapi.kafka.publishers.push(publisher);
            console.log(
              `Kafka publisher ${clientId} configuration is valid!`,
            );
          }
        } else {
          strapi.log.warn(
            `Kafka publisher ${clientId} got disabled!`,
          );
        }
      } catch (err) {
        strapi.log.warn(
          `Kafka publisher ${clientId} got disabled or configuration is invalid!`,
        );
      }
    });

    // Subscribers..
    const { subscribers } = config;
    // console.log('Subscribers:', subscribers);
    subscribers.forEach(subscriber => {
      const {
        enabled,
        clientId,
        topic,
        brokers,
      } = subscriber;
      try {
        if (enabled) {
          if (
            typeof clientId === 'string' &&
            typeof topic === 'string' &&
            brokers.length > 0
          ) {
            strapi.kafka.subscribers.push(subscriber);
            console.log(
              `Kafka subscriber ${clientId} configuration is valid!`,
            );
          }
        } else {
          strapi.log.warn(
            `Kafka subscriber ${clientId} got disabled!`,
          );
        }
      } catch (err) {
        strapi.log.warn(
          `Kafka subscriber ${clientId} got disabled or configuration is invalid!`,
        );
      }
    });
  },
};
