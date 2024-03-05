import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Fruta', 'Leite', 'Leite e Derivados', 'Grãos', 'Verduras', 'Carnes', 'Peixes', 'Especiarias'],
    required: true
  }
});

export const Category = mongoose.model('Category', categorySchema);
