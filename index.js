import express from "express" 
import { PORT, mongoDBURL } from "./config.js"
import mongoose from 'mongoose'
import recipesRoute from './routes/recipesRoute.js'
import ingredientsRoute from './routes/ingredientsRoute.js'
import unitOfMeasuresRoute from './routes/unitOfMeasuresRoute.js'
import categoriesRoute from './routes/categoriesRoute.js'
import ingredientsRecipeRoute from './routes/ingredientsRecipeRoute.js'
import usersRoute from './routes/usersRoute.js'
import cors from 'cors'

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