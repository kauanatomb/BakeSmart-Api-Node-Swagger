const mongoose = require('mongoose');

const abbreviationMap = {
  Kilogram: 'kg',
  Grams: 'g',
  Unit: 'unid',
  Liter: 'l',
  Milliliter: 'ml',
};

const unitOfMeasureSchema = new mongoose.Schema({
  unit: {
    type: String,
    enum: ['Kilogram', 'Grams', 'Unit', 'Liter', 'Milliliter'],
    required: true
  },
  abbreviation: {
    type: String
  }
});

unitOfMeasureSchema.pre('save', function (next) {
  this.abbreviation = abbreviationMap[this.unit];
  next();
});

module.exports = mongoose.model('UnitOfMeasure', unitOfMeasureSchema);

