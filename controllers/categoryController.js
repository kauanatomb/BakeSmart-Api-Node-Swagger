const Category = require('../models/categoryModel');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, 'name');
    res.json({
      count: categories.length, 
      categories: categories});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  getAllCategories,
  createCategory
}