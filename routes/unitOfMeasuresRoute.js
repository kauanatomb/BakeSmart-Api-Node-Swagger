const express = require('express');
const { getAllUnitOfMeasures, createUnitOfMeasure } = require('../controllers/unitOfMeasureController.js');

const router = express.Router()

router.get('/unitofmeasures', getAllUnitOfMeasures);

router.post('/unitofmeasures', createUnitOfMeasure);

module.exports = router