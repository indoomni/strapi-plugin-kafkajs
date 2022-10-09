'use strict';

const util = require('util');

console.log('Kafka bootstrap..');

module.exports = async ({ strapi }) => {
  const { publishers } = strapi.kafka;
  try {
    await publishers.forEach(async publisher => {
      if (
        (publisher.producer = await strapi
          .plugin('kafkajs')
          .controller('publisher')
          .init(publisher))
      ) {
        strapi.log.debug(
          `Kafka publisher connected: ${util.inspect(
            publisher.clientId,
          )}`,
        );
        // Send message to topic in background..
        // setTimeout(async () => {
        const { topic } = publisher;
        const message = "Hello, it's Kafka!";
        await strapi
          .plugin('kafkajs')
          .controller('publisher')
          .publish(publisher.clientId, topic, message);
        // }, 2000);
      }
    });
  } catch (err) {
    strapi.log.error(err);
  }
  strapi.log.info(
    `Bootstrapped publishers: ${util.inspect(publishers)}`,
  );

  const { subscribers } = strapi.kafka;
  try {
    subscribers.forEach(async subscriber => {
      if (
        (subscriber.consumer = await strapi
          .plugin('kafkajs')
          .controller('subscriber')
          .init(subscriber))
      ) {
        strapi.log.debug(
          `Kafka subscriber connected: ${util.inspect(
            subscriber.clientId,
          )}`,
        );
        // Subscribe to topic in background..
        // setTimeout(async () => {
        let eachMessage;
        if (subscriber.handler) {
          console.log('Current directory:', __dirname);
          const dirname = strapi.dirs.dist.src;
          const handler = require(`${dirname}/${subscriber.handler}`);
          eachMessage = handler.eachMessage;
        } else {
          eachMessage = async ({
            topic,
            partition,
            offset,
            message,
          }) => {
            const payload = message.value.toString();
            strapi.log.info(
              `Received message from topic: ${topic} partition: ${partition} offset: ${offset}`,
            );
            strapi.log.info(
              `Locate the sample handler file; edit as per your requirements.`,
            );
            try {
              let object;
              if ((object = JSON.parse(payload))) {
                strapi.log.info('Do something...');
                // Do something..
                strapi.log.info('Done!');
              }
            } catch (err) {
              strapi.log.info('Pass!');
            }
          };
        }

        const { topic } = subscriber;
        await strapi
          .plugin('kafkajs')
          .controller('subscriber')
          .subscribe(
            subscriber.clientId,
            topic,
            eachMessage,
          );
        // }, 0);
      }
    });
  } catch (err) {
    strapi.log.error(err);
  }
  strapi.log.info(
    `Bootstrapped subscribers: ${util.inspect(
      subscribers,
    )}`,
  );
};
