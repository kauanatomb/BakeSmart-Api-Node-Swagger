const express = require('express')
const { mongoDBURL } = require('./config/config.js')
const mongoose = require('mongoose')
const recipesRoute = require('./routes/recipesRoute.js')
const ingredientsRoute = require('./routes/ingredientsRoute.js')
const unitOfMeasuresRoute = require('./routes/unitOfMeasuresRoute.js')
const categoriesRoute = require('./routes/categoriesRoute.js')
const ingredientsRecipeRoute = require('./routes/ingredientsRecipeRoute.js')
const usersRoute = require('./routes/usersRoute.js')
const cors = require('cors')
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('./swagger_documentation.json')

const app = express()

// middleware for parsing request body
app.use(express.json())

// Middleware for handling CORS Policy
// Option 1: Allow all origins with Default of cors(*)
app.use(cors())

app.use('/', recipesRoute)
app.use('/', ingredientsRoute)
app.use('/', unitOfMeasuresRoute)
app.use('/', categoriesRoute)
app.use('/', ingredientsRecipeRoute)
app.use('/', usersRoute)
// swagger documentation
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const PORT = process.env.PORT || 5555;

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