const express = require('express');
const { getAllIngredients, createIngredient, updateIngredient, deleteOneIngredient, getOneIngredient } = require('../controllers/ingredientController.js');
const auth = require('../middleware/auth.js');

const router = express.Router()

router.get('/ingredients', auth, getAllIngredients);

router.post('/ingredients', auth, createIngredient);

router.put('/ingredients/:id', auth, updateIngredient);

router.delete('/ingredients/:id', auth, deleteOneIngredient);

router.get('/ingredients/:id', auth, getOneIngredient);

module.exports = router