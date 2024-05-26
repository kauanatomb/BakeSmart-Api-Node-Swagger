const express = require('express')
const { createRecipe, getAllRecipes, getOneRecipe, updateOneRecipe, deleteOneRecipe } = require('../controllers/recipeController.js')
const auth = require('../middleware/auth.js')


const router = express.Router()

router.post('/recipes', createRecipe);

router.get('/recipes', getAllRecipes);

router.get(`/recipes/:id`, getOneRecipe)

router.put('/recipes/:id', updateOneRecipe)

router.delete('/recipes/:id', deleteOneRecipe)

module.exports = router