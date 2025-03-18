const express = require('express')
const { mongoDBURL } = require('./config/config.js')
const mongoose = require('mongoose')
const recipesRoute = require('./routes/recipesRoute.js')
const ingredientsRoute = require('./routes/ingredientsRoute.js')
const unitOfMeasuresRoute = require('./routes/unitOfMeasuresRoute.js')
const categoriesRoute = require('./routes/categoriesRoute.js')
const ingredientsRecipeRoute = require('./routes/ingredientsRecipeRoute.js')
const cors = require('cors')
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('./swagger_documentation.json')

const app = express()

// Middleware for handling CORS Policy
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// middleware for parsing request body
app.use(express.json())

//Routes
app.use('/', recipesRoute)
app.use('/', ingredientsRoute)
app.use('/', unitOfMeasuresRoute)
app.use('/', categoriesRoute)
app.use('/', ingredientsRecipeRoute)

// swagger documentation
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;

mongoose
.connect(mongoDBURL)
.then(() => {
  console.log('App conected to database');
  app.listen(PORT, () => {
    console.log(`App is listening to port: ${PORT}`);
  })
  }).catch((error) => {
    console.log(error);
  });