const swaggerAutogen = require('swagger-autogen')();

const outputFile = 'swagger_documentation.json';
const endpoints = [
  'routes/categoriesRoute.js',
  'routes/unitOfMeasuresRoute.js',
  'routes/ingredientsRoute.js',
  'routes/recipesRoute.js',
  'routes/ingredientsRecipeRoute.js',
];

swaggerAutogen(outputFile, endpoints);