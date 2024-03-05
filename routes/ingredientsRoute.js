import express from 'express' 
import { getAllIngredients, createIngredient, updateIngredient, deleteOneIngredient, getOneIngredient } from "../controllers/ingredientController.js";
import auth from '../middleware/auth.js'

const router = express.Router()

router.get('/', auth, getAllIngredients);

router.post('/', auth, createIngredient);

router.put('/:id', auth, updateIngredient);

router.delete('/:id', auth, deleteOneIngredient);

router.get('/:id', auth, getOneIngredient);

export default router