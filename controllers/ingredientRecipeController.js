const IngredientRecipe = require('../models/ingredientRecipeModel');
const Ingredient = require('../models/ingredientModel');
const UnitOfMeasure = require('../models/unitOfMeasureModel');
const Recipe = require('../models/recipeModel');
const { calculateCost } = require('../services/costService');

const getAllIngredientsRecipe = async (request, response, next) => {
  const { recipeId } = request.params;
  try {
    const ingredientsRecipe = await IngredientRecipe.find({ recipe: recipeId })
      .populate('ingredient')
      .populate('unitOfMeasure');

    const costRecipe = await calculateCost(ingredientsRecipe);

    response.json({
      count: ingredientsRecipe.length,
      data: ingredientsRecipe,
      price: costRecipe,
    });
  } catch (error) {
    next(error);
  }
};

const addIngredientsToRecipe = async (request, response, next) => {
  const { recipeId } = request.params;
  const { ingredients } = request.body;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return response.status(404).json({ message: 'Recipe not found' });
    }

    if (!Array.isArray(ingredients)) {
      return response.status(400).json({ message: 'Ingredients should be an array' });
    }

    const createdIngredients = [];

    for (const ingredientData of ingredients) {
      const { ingredientId, unitOfMeasureId, quantity } = ingredientData;

      const unitOfMeasure = await UnitOfMeasure.findById(unitOfMeasureId);
      const ingredient = await Ingredient.findById(ingredientId);

      if (!ingredient || !unitOfMeasure) {
        return response.status(404).json({
          message: `Ingredient or unit of measure not found for ingredient '${ingredientId}' / unit '${unitOfMeasureId}'`,
        });
      }

      const ingredientRecipe = new IngredientRecipe({
        recipe: recipeId,
        ingredient: ingredient._id,
        quantity,
        unitOfMeasure: unitOfMeasure._id,
      });

      createdIngredients.push(await ingredientRecipe.save());
    }

    response.status(201).json(createdIngredients);
  } catch (error) {
    next(error);
  }
};

const updateIngredientsForRecipe = async (request, response, next) => {
  try {
    const { recipeId } = request.params;
    const { ingredients } = request.body;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return response.status(400).json({ message: 'Ingredients should be a non-empty array' });
    }

    const updatedIngredients = [];

    for (const ingredientData of ingredients) {
      const { ingredientName, quantity, unitOfMeasureUnit } = ingredientData;

      const unitOfMeasure = await UnitOfMeasure.findOne({ unit: unitOfMeasureUnit });
      const ingredient = await Ingredient.findOne({ name: ingredientName });

      if (!ingredient || !unitOfMeasure) {
        return response.status(404).json({
          message: `Ingredient '${ingredientName}' or unit of measure '${unitOfMeasureUnit}' not found`,
        });
      }

      const updatedIngredient = await IngredientRecipe.findOneAndUpdate(
        { recipe: recipeId, ingredient: ingredient._id },
        { quantity, unitOfMeasure: unitOfMeasure._id },
        { new: true }
      );

      if (!updatedIngredient) {
        return response.status(404).json({
          message: `No ingredient recipe found for recipe '${recipeId}' and ingredient '${ingredientName}'`,
        });
      }

      updatedIngredients.push(updatedIngredient);
    }

    response.status(200).json({ message: 'Ingredients updated successfully', updatedIngredients });
  } catch (error) {
    next(error);
  }
};

const deleteOneIngredientRecipe = async (request, response, next) => {
  try {
    const { recipeId, id } = request.params;

    const result = await IngredientRecipe.deleteOne({ ingredient: id, recipe: recipeId });

    if (result.deletedCount === 0) {
      return response.status(404).json({ message: 'Ingredient Recipe not found' });
    }

    return response.status(200).send({ message: 'Ingredient Recipe deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllIngredientsRecipe,
  addIngredientsToRecipe,
  updateIngredientsForRecipe,
  deleteOneIngredientRecipe,
};