console.log('Kafka routes..');

module.exports = [
  {
    method: 'GET',
    path: '/test',
    handler: 'test.index',
    config: {
      policies: [],
    },
  },
];
