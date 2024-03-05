import mongoose from 'mongoose'

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
    ref: 'UnitOfMeasure'
  },
  price: {
    type: Number,
    required: true
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: "User" 
  }
});

export const Ingredient = mongoose.model('Ingredient', ingredientSchema);
