const swaggerAutogen = require('swagger-autogen')();
const doc = require('./config/swagger');

const outputFile = 'swagger_documentation.json';
const endpoints = ['routes/categoriesRoute.js', 'routes/ingredientsRecipeRoute.js', 'routes/ingredientsRoute.js', 'routes/recipesRoute.js', 'routes/unitOfMeasuresRoute.js', 'routes/usersRoute.js'];

swaggerAutogen(outputFile, endpoints, doc);