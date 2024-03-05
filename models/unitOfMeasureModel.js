import mongoose from 'mongoose'

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

export const UnitOfMeasure = mongoose.model('UnitOfMeasure', unitOfMeasureSchema);

