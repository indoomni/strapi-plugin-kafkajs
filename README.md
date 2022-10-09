# 🚀 Getting started with Strapi

Wrapper for KafkaJS library to be used with Strapi apps. You are going to need a live [Kafka](https://kafka.apache.org/) instance/cluster to be running. The Strapi app will be able to act as publisher and/or subscriber.
<br/>
As added bonus, you can setup multiple publishers as well as subscribers within the same Strapi app; e.g., one for logging, one for notifications, one for... You name it.
<br/><br/>

### `Installation`

Add the library to your Strapi project. [Learn more](https://www.npmjs.com/package/@indoomni/strapi-plugin-kafkajs)

```

yarn add @indoomni/strapi-plugin-kafkajs
yarn install
yarn build

```

<br/>

### `Configuration`

Add the following configuration attributes to your **server.js**.

```

# config/server.js or config/env/**/server.js
# -------------------------------------------

module.exports = ({ env }) => ({
  host: env('HOST'),
  port: env.int('PORT'),
  app: {
    env: env('ENV'),
    name: env('APP_NAME'),
    keys: env.array('APP_KEYS'),
  },
  // ...
  kafkajs: {
    enabled: true,
    config: {
      publishers: [
        {
          enabled: true,
          clientId: `${env('APP_NAME')}_${env('ENV')}_log_pub`,
          topic: `Ngapi_${env('ENV')}_logs`,
          brokers: ['kafka:9092'],
        },
      ],
      subscribers: [
        {
          enabled: true,
          clientId: `${env('APP_NAME')}_${env('ENV')}_log_sub`,
          topic: `Ngapi_${env('ENV')}_logs`,
          brokers: ['kafka:9092'],
          handler: 'kafka-logger.js',
        },
      ],
    },
  },
  // ...
});

```

Notice the **publishers** attribute. Here, you can add multiple producers where each one will be identified by its **clientId**. When connection to each **broker(s)** is established, you will be able to publish messages/jobs into the said **topic**.

Now, notice the **subscribers** attribute. Here, you can add multiple consumers where each one will be identified also by its **clientId**. When connection to each **broker(s)** is established, the subscriber will merge into available consumer groups managed by the broker and its Zookeeper, and will subscribe (or "listen" if that's your thing) to the said **topic**. The library will automatically poll for new messages/jobs; any incoming message/job will be fed into an asynchronous "eachMessage" function in the Javascript file pointed by the **handler** attribute. We'll discuss this along.

<br/>

### `How to publish messages or jobs?`

Anywhere in your code (for example in a middleware to stream access logs to the some logger on the other side), write as in the following snippet. Refer to the **publisher** controller inside the library, and call **publish** function. Keep note of the set client ID and topic set up in the `Configuration` step.

```

# src/middlewares/kafkaLogger.js
# ------------------------------

// ...
setTimeout(async () => {
  const log = {
    uuid: ctx.uuid,
    timestamp: ctx.timestamp,
    timer: Math.ceil(Date.now() - start) + 'ms',
    request,
    response,
    stack: ctx.stack,
  };
  const clientId = `${strapi.appName}_${strapi.appEnv}_log_pub`;
  const topic = `Ngapi_${strapi.appEnv}_logs`;
  const message = JSON.stringify(log);
  await strapi
    .plugin('kafkajs')
    .controller('publisher')
    .publish(clientId, topic, message);
}, 0);
// ...

```

<br/>

### `How to subscribe to messages or jobs?`

Remember the **handler** attribute from the `Configuration` step? In the example configuration, it should point to your own implementation, named **.../src/handler.js**. If you put the JS file somewhere else, just modify the path. The path is relative to folder **src** in your code.

```

# src/handler.js
# --------------

'use strict';

module.exports = {
  eachMessage: async ({
    topic,
    partition,
    offset,
    message,
  }) => {
    const payload = message.value.toString();
    strapi.log.info(
      `I am sample handler file ${__filename}, edit me..`,
    );
    strapi.log.info(
      `Received message from topic: ${topic} partition: ${partition} offset: ${offset}`,
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
  },
};


```

<br/>

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Kafka Docker Hub page](https://hub.docker.com/r/confluentinc/cp-kafka/)
- [Zookeeper Docker Hub page](https://hub.docker.com/_/zookeeper)

<br/>

---

<sub>Feel free to check out my [GitHub repository](https://github.com/indoomni/strapi-plugin-kafkajs). Your feedback and contributions are welcome!</sub>
