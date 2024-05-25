const mongoose = require('mongoose');

const abbreviationMap = {
  Kilograma: 'kg',
  Gramas: 'g',
  Unidade: 'unid'
};

const unitOfMeasureSchema = new mongoose.Schema({
  unit: {
    type: String,
    enum: ['Kilograma', 'Gramas', 'Unidade'],
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

