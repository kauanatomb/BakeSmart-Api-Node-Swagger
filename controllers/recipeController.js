import { Recipe } from '../models/recipeModel.js'
import { IngredientRecipe } from '../models/ingredientRecipeModel.js'
import { Ingredient } from '../models/ingredientModel.js';
import { UnitOfMeasure } from '../models/unitOfMeasureModel.js';

const createRecipe = async (request, response) => {
  try {
    const { name, description, cookTime } = request.body;
    const userId = request.user.id

    const newRecipe = { 
      name, 
      description, 
      cookTime,
      owner: userId 
    };

    const recipe = await Recipe.create(newRecipe);

    return response.status(201).send({ _id: recipe._id });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: `Internal Server Error` });
  }
};

const getAllRecipes = async (request, response) => {
  try {

    const userId = request.user.id
    const recipes = await Recipe.find({ owner: userId }).lean();
    const recipesWithIngredients = [];

    for (const recipe of recipes) {
      const ingredientsRecipe = await IngredientRecipe.find({ recipe: recipe._id })
        .populate('ingredient', 'name')
        .populate('unitOfMeasure', 'unit')
        .lean();

      const ingredients = ingredientsRecipe.map(({ ingredient, quantity, unitOfMeasure }) => ({
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
        owner: recipe.owner,
        ingredients,
      };

      recipesWithIngredients.push(recipeWithIngredients);
    }

    response.json({ data: recipesWithIngredients });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};

const getOneRecipe = async (request,response) => {
  try {
    const userId = request.user.id
    const { id } = request.params;
    const recipe = await Recipe.findOne({ _id: id, owner: userId }).lean();
    const recipesWithIngredients = [];

    const ingredientsRecipe = await IngredientRecipe.find({ recipe: id })
      .populate('ingredient', 'name')
      .populate('unitOfMeasure', 'unit')
      .lean();

      const costRecipe = await calculateCost(ingredientsRecipe)

      const ingredients = ingredientsRecipe.map(({ ingredient, quantity, unitOfMeasure }) => ({
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
        owner: recipe.owner,
        ingredients,
        costRecipe
      };

      recipesWithIngredients.push(recipeWithIngredients);

    return response.status(200).json({ 
      data: recipeWithIngredients
    })
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message })
  }
}

const updateOneRecipe = async (request, response) => {
  try {
    const { id } = request.params;
    const userId = request.user.id

    const updatedRecipe = await Recipe.findOneAndUpdate({ _id: id, owner: userId }, request.body, { new: true });

    if (!updatedRecipe) {
      return response.status(404).json({ message: 'Recipe not found' });
    }

    response.status(200).json({ message: 'Recipe updated successfully', updatedRecipe });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};

const deleteOneRecipe = async (request, response) => {
  try {
    const { id } = request.params
    const userId = request.user.id

    IngredientRecipe.deleteMany({ recipe: id, owner: userId })
    .then((result) => {
      console.log(`${result.deletedCount} documents removed with sucess!`);
    })
    .catch((error) => {
      console.error('Error to remove document:', error);
    });

    const result = await Recipe.findByIdAndDelete(id)

    if (!result) {
      return response.status(404).json( {message: 'Recipe not found' })
    }

    return response.status(200).send({ message: 'Recipe deleted successfully' })
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message })
  }
}

async function calculateCost(ingredientsRecipe) {
  let totalCost = 0;

  for (const { recipe, ingredient, quantity, unitOfMeasure } of ingredientsRecipe) {
    const ingrediente = await Ingredient.findById(ingredient).populate('unitOfMeasure').exec();
    const recipeIngredientUnit = unitOfMeasure.unit;

    if (recipeIngredientUnit !== ingrediente.unitOfMeasure.unit) {
      const convertedQuantity = convertUnitOfMeasure(quantity, recipeIngredientUnit, ingrediente.unitOfMeasure.unit);
      const cost = (convertedQuantity / ingrediente.quantity) * ingrediente.price;
      totalCost += cost;
    } else {
      const cost = (quantity / ingrediente.quantity) * ingrediente.price;
      totalCost += cost;
    }
  }
  
  return totalCost;
}

function convertUnitOfMeasure(quantity, recipeUnit, ingredientUnit) {
  if (recipeUnit === "Kilograma" && ingredientUnit === "Gramas") {
    return quantity * 1000
  } else if (recipeUnit === "Gramas" && ingredientUnit === "Kilograma") {
    return quantity / 1000
  } else {
    throw new Error(`Incompatible units for conversion ${quantity} ${recipeUnit} ${ingredientUnit} `);
  }
}

export { createRecipe, getAllRecipes, getOneRecipe, updateOneRecipe, deleteOneRecipe };

