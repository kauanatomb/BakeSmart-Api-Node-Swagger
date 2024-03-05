import express from 'express' 
import { getAllUnitOfMeasures, createUnitOfMeasure } from '../controllers/unitOfMeasureController.js'

const router = express.Router()

router.get('/', getAllUnitOfMeasures);

router.post('/', createUnitOfMeasure);

export default router