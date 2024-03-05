import express from 'express' 
import { createRecipe, getAllRecipes, getOneRecipe, updateOneRecipe, deleteOneRecipe } from '../controllers/recipeController.js';
import auth from '../middleware/auth.js'


const router = express.Router()

router.post('/', auth, createRecipe);

router.get('/', auth, getAllRecipes);

router.get(`/:id`, auth, getOneRecipe)

router.put('/:id', auth, updateOneRecipe)

router.delete('/:id', auth, deleteOneRecipe)

export default router