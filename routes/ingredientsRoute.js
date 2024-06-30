const express = require('express');
const { getAllIngredients, createIngredient, updateIngredient, deleteOneIngredient, getOneIngredient } = require('../controllers/ingredientController.js');

const router = express.Router()

router.get('/ingredients', getAllIngredients);

router.post('/ingredients', createIngredient);

router.put('/ingredients/:id', updateIngredient);

router.delete('/ingredients/:id', deleteOneIngredient);

router.get('/ingredients/:id', getOneIngredient);

module.exports = router