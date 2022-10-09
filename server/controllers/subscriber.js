'use strict';

const { Kafka } = require('kafkajs');
const util = require('util');

module.exports = ({ strapi }) => ({
  init: async config => {
    const kafka = new Kafka(config);
    const consumer = kafka.consumer({
      groupId: config.clientId,
    });

    const run = async () => {
      await consumer.connect();
    };
    await run().catch(console.error);

    return consumer;
  },
  deinit: async clientId => {
    const subscriber = strapi.kafka.subscribers.find(
      sub => sub.clientId === clientId,
    );
    await subscriber.consumer.disconnect();
  },
  subscribe: async (clientId, topic, eachMessage) => {
    try {
      const subscriber = strapi.kafka.subscribers.find(
        sub => sub.clientId === clientId,
      );
      await subscriber.consumer.subscribe({
        topic,
        fromBeginning: true,
      });
      await subscriber.consumer.run({
        eachMessage,
      });
    } catch (err) {
      strapi.log.error(err);
    }
  },
});
