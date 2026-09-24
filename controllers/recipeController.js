const Recipe = require('../models/recipeModel');
const IngredientRecipe = require('../models/ingredientRecipeModel');
const { calculateCost } = require('../services/costService');

const createRecipe = async (request, response, next) => {
  try {
    const { name, description, cookTime } = request.body;

    if (!name || !description) {
      return response.status(400).send({ message: 'Name and description are required' });
    }

    const newRecipe = { name, description, cookTime };

    const recipe = await Recipe.create(newRecipe);

    return response.status(201).send({ _id: recipe._id });
  } catch (error) {
    next(error);
  }
};

const getAllRecipes = async (request, response, next) => {
  try {
    const recipes = await Recipe.find({}).lean();
    const recipeIds = recipes.map((recipe) => recipe._id);

    const ingredientRecipes = await IngredientRecipe.find({ recipe: { $in: recipeIds } })
      .populate('ingredient', 'name')
      .populate('unitOfMeasure', 'unit')
      .lean();

    const recipesWithIngredients = recipes.map((recipe) => ({
      _id: recipe._id,
      name: recipe.name,
      description: recipe.description,
      cookTime: recipe.cookTime,
      ingredients: ingredientRecipes
        .filter(({ recipe: recipeId, ingredient, unitOfMeasure }) =>
          String(recipeId) === String(recipe._id) && ingredient && unitOfMeasure
        )
        .map(({ ingredient, quantity, unitOfMeasure }) => ({
          _id: ingredient._id,
          name: ingredient.name,
          quantity,
          unitOfMeasure: {
            _id: unitOfMeasure._id,
            unit: unitOfMeasure.unit,
          },
        })),
    }));

    response.json({ data: recipesWithIngredients });
  } catch (error) {
    next(error);
  }
};

const getOneRecipe = async (request, response, next) => {
  try {
    const { id } = request.params;

    const recipe = await Recipe.findById(id).lean();

    if (!recipe) {
      return response.status(404).json({ message: 'Recipe not found' });
    }

    const ingredientsRecipe = await IngredientRecipe.find({ recipe: id })
      .populate('ingredient', 'name')
      .populate('unitOfMeasure', 'unit')
      .lean();

    const costRecipe = await calculateCost(ingredientsRecipe);

    const ingredients = ingredientsRecipe
      .filter(({ ingredient, unitOfMeasure }) => ingredient && unitOfMeasure)
      .map(({ ingredient, quantity, unitOfMeasure }) => ({
        _id: ingredient._id,
        name: ingredient.name,
        quantity,
        unitOfMeasure: {
          _id: unitOfMeasure._id,
          unit: unitOfMeasure.unit,
        },
      }));

    const recipeWithIngredients = {
      _id: recipe._id,
      name: recipe.name,
      description: recipe.description,
      cookTime: recipe.cookTime,
      ingredients,
      costRecipe,
    };

    return response.status(200).json({ data: recipeWithIngredients });
  } catch (error) {
    next(error);
  }
};

const updateOneRecipe = async (request, response, next) => {
  try {
    const { id } = request.params;

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, request.body, { new: true });

    if (!updatedRecipe) {
      return response.status(404).json({ message: 'Recipe not found' });
    }

    response.status(200).json({ message: 'Recipe updated successfully', updatedRecipe });
  } catch (error) {
    next(error);
  }
};

const deleteOneRecipe = async (request, response, next) => {
  try {
    const { id } = request.params;

    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      return response.status(404).json({ message: 'Recipe not found' });
    }

    await IngredientRecipe.deleteMany({ recipe: id });

    return response.status(200).send({ message: 'Recipe deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getOneRecipe,
  updateOneRecipe,
  deleteOneRecipe,
};