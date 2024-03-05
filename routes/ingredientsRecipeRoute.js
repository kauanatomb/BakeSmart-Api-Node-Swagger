import express from 'express' 
import { addIngredientsToRecipe, deleteOneIngredientRecipe, getAllIngredientsRecipe, updateIngredientsForRecipe } from '../controllers/ingredientRecipeController.js'

const router = express.Router()

router.post('/recipes/:recipeId/ingredients', addIngredientsToRecipe);
router.get('/recipes/:recipeId/ingredients', getAllIngredientsRecipe);
router.put('/recipes/:recipeId/ingredients', updateIngredientsForRecipe);
router.delete('/recipes/:recipeId/ingredients/:id', deleteOneIngredientRecipe)

export default router