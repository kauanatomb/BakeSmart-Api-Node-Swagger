const express = require('express')
const { addIngredientsToRecipe, getAllIngredientsRecipe, updateIngredientsForRecipe, deleteOneIngredientRecipe } = require('../controllers/ingredientRecipeController.js')

const router = express.Router()

router.post('/recipes/:recipeId/ingredients', addIngredientsToRecipe);
router.get('/recipes/:recipeId/ingredients', getAllIngredientsRecipe);
router.put('/recipes/:recipeId/ingredients', updateIngredientsForRecipe);
router.delete('/recipes/:recipeId/ingredients/:id', deleteOneIngredientRecipe)

module.exports = router