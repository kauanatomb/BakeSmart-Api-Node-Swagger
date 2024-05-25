const UnitOfMeasure = require('../models/unitOfMeasureModel');

const getAllUnitOfMeasures = async (req, res) => {
  try {
    const unitOfMeasures = await UnitOfMeasure.find({}, 'unit abbreviation');
    res.json({
      count: unitOfMeasures.length, 
      unitOfMeasures: unitOfMeasures
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const createUnitOfMeasure = async (req, res) => {
  const { unit } = req.body;

  try {
    const newUnitOfMeasure = await UnitOfMeasure.create({ unit });
    res.status(201).json(newUnitOfMeasure);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
} 

module.exports = {
  getAllUnitOfMeasures,
  createUnitOfMeasure
}