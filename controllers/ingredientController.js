const Ingredient = require('../models/ingredientModel');
const Category = require('../models/categoryModel');
const UnitOfMeasure = require('../models/unitOfMeasureModel');
const IngredientRecipe = require('../models/ingredientRecipeModel');

const getAllIngredients = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.find({})
      .populate('category', 'name')
      .populate('unitOfMeasure', 'unit abbreviation');

    res.json({
      count: ingredients.length,
      data: ingredients,
    });
  } catch (error) {
    next(error);
  }
};

const createIngredient = async (req, res, next) => {
  const { name, quantity, brand, category, unitOfMeasure, price } = req.body;

  try {
    if (!name || !quantity || !brand || !category || !unitOfMeasure || !price) {
      return res.status(400).json({
        message: 'All fields are required: name, quantity, brand, category, unitOfMeasure, price',
      });
    }

    const findCategory = await Category.findOne({ name: category });
    if (!findCategory) {
      return res.status(404).json({ message: `Category '${category}' not found.` });
    }

    const findUnitOfMeasure = await UnitOfMeasure.findOne({ unit: unitOfMeasure });
    if (!findUnitOfMeasure) {
      return res.status(404).json({ message: `Unit of measure '${unitOfMeasure}' not found.` });
    }

    const newIngredient = await Ingredient.create({
      name,
      quantity,
      brand,
      category: findCategory._id,
      unitOfMeasure: findUnitOfMeasure._id,
      price,
    });

    res.status(201).json(newIngredient);
  } catch (error) {
    next(error);
  }
};

const updateIngredient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, quantity, brand, category, unitOfMeasure, price } = req.body;

    if (!category || !unitOfMeasure) {
      return res.status(400).json({ message: 'Category and unit of measure are required' });
    }

    const findUnitOfMeasure = await UnitOfMeasure.findOne({ unit: unitOfMeasure });
    if (!findUnitOfMeasure) {
      return res.status(404).json({ message: `Unit of measure '${unitOfMeasure}' not found.` });
    }

    const findCategory = await Category.findOne({ name: category });
    if (!findCategory) {
      return res.status(404).json({ message: `Category '${category}' not found.` });
    }

    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      id,
      {
        name,
        quantity,
        brand,
        category: findCategory._id,
        unitOfMeasure: findUnitOfMeasure._id,
        price,
      },
      { new: true }
    );

    if (!updatedIngredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    res.json(updatedIngredient);
  } catch (error) {
    next(error);
  }
};

const deleteOneIngredient = async (req, resp, next) => {
  try {
    const { id } = req.params;

    const ingredient = await Ingredient.findByIdAndDelete(id);

    if (!ingredient) {
      return resp.status(404).json({ message: 'Ingredient not found' });
    }

    await IngredientRecipe.deleteMany({ ingredient: id });

    return resp.status(200).send({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getOneIngredient = async (req, res, next) => {
  const { id } = req.params;
  try {
    const ingredient = await Ingredient.findById(id)
      .populate('category')
      .populate('unitOfMeasure');

    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    res.status(200).json(ingredient);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllIngredients,
  createIngredient,
  updateIngredient,
  deleteOneIngredient,
  getOneIngredient,
};