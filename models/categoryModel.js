const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Fruta', 'Leite', 'Leite e Derivados', 'Grãos', 'Verduras', 'Carnes', 'Peixes', 'Especiarias'],
    required: true
  }
});

module.exports = mongoose.model('Category', categorySchema);
