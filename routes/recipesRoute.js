const express = require('express')
const { createRecipe, getAllRecipes, getOneRecipe, updateOneRecipe, deleteOneRecipe } = require('../controllers/recipeController.js')
const auth = require('../middleware/auth.js')


const router = express.Router()

router.post('/recipes', auth, createRecipe);

router.get('/recipes', auth, getAllRecipes);

router.get(`/recipes/:id`, auth, getOneRecipe)

router.put('/recipes/:id', auth, updateOneRecipe)

router.delete('/recipes/:id', auth, deleteOneRecipe)

module.exports = router