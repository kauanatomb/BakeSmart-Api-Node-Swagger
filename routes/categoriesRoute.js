const express = require('express')
const { getAllCategories, createCategory } = require('../controllers/categoryController')

const router = express.Router()

router.get('/categories', getAllCategories);

router.post('/categories', createCategory);

module.exports = router