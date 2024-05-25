const express = require('express');
const { getAllIngredients, createIngredient, updateIngredient, deleteOneIngredient, getOneIngredient } = require('../controllers/ingredientController.js');
const auth = require('../middleware/auth.js');

const router = express.Router()

router.get('/', auth, getAllIngredients);

router.post('/', auth, createIngredient);

router.put('/:id', auth, updateIngredient);

router.delete('/:id', auth, deleteOneIngredient);

router.get('/:id', auth, getOneIngredient);

module.exports = router