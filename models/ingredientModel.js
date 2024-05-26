const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  unitOfMeasure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UnitOfMeasure',
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
