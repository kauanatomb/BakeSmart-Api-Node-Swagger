const express = require('express')
const { createRecipe, getAllRecipes, getOneRecipe, updateOneRecipe, deleteOneRecipe } = require('../controllers/recipeController.js')
const auth = require('../middleware/auth.js')


const router = express.Router()

router.post('/', auth, createRecipe);

router.get('/', auth, getAllRecipes);

router.get(`/:id`, auth, getOneRecipe)

router.put('/:id', auth, updateOneRecipe)

router.delete('/:id', auth, deleteOneRecipe)

module.exports = router