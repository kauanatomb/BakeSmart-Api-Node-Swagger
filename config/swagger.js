module.exports = {
  info: {
    version: '1.0.0',
    title: 'BakeSmart API',
    description: 'Documentation of BakeSmart API',
  },
  host: 'nodeapi-production-ebd3.up.railway.app',
  schemes: 'https',
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    JWT: {
      description: 'JWT token',
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    },
  },
  definitions: {
  },
};