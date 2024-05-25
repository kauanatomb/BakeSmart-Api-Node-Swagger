const express = require('express');
const { getAllUnitOfMeasures, createUnitOfMeasure } = require('../controllers/unitOfMeasureController.js');

const router = express.Router()

router.get('/', getAllUnitOfMeasures);

router.post('/', createUnitOfMeasure);

module.exports = router