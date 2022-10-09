'use strict';

const { Kafka } = require('kafkajs');
const util = require('util');

module.exports = ({ strapi }) => ({
  init: async config => {
    const kafka = new Kafka(config);
    // const producer = kafka.producer();
    const { Partitioners } = require('kafkajs');
    const producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });

    const run = async () => {
      await producer.connect();
    };
    await run().catch(console.error);

    return producer;
  },
  deinit: async clientId => {
    const publisher = strapi.kafka.publishers.find(
      pub => pub.clientId === clientId,
    );
    await publisher.producer.disconnect();
  },
  publish: async (clientId, topic, message) => {
    try {
      const publisher = strapi.kafka.publishers.find(
        pub => pub.clientId === clientId,
      );
      await publisher.producer.send({
        topic,
        messages: [{ value: message }],
      });
    } catch (err) {
      strapi.log.error(err);
    }
  },
});
