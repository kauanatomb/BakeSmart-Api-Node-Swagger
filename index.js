const express = require('express')
const { mongoDBURL } = require('./config.js')
const mongoose = require('mongoose')
const recipesRoute = require('./routes/recipesRoute.js')
const ingredientsRoute = require('./routes/ingredientsRoute.js')
const unitOfMeasuresRoute = require('./routes/unitOfMeasuresRoute.js')
const categoriesRoute = require('./routes/categoriesRoute.js')
const ingredientsRecipeRoute = require('./routes/ingredientsRecipeRoute.js')
const usersRoute = require('./routes/usersRoute.js')
const cors = require('cors')
const dotenv = require('dotenv')

const app = express()

// middleware for parsing request body
app.use(express.json())

// Middleware for handling CORS Policy
// Option 1: Allow all origins with Default of cors(*)
app.use(cors())

app.use('/recipes', recipesRoute)
app.use('/ingredients', ingredientsRoute)
app.use('/unitofmeasures', unitOfMeasuresRoute)
app.use('/categories', categoriesRoute)
app.use('/', ingredientsRecipeRoute)
app.use('/user', usersRoute)

app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('Welcome to my first app MERN')
})

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