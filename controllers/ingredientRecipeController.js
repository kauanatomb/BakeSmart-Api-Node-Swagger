const IngredientRecipe = require('../models/ingredientRecipeModel');
const Ingredient = require('../models/ingredientModel');
const UnitOfMeasure = require('../models/unitOfMeasureModel');
const Recipe = require('../models/recipeModel');

const getAllIngredientsRecipe = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const ingredientsRecipe = await IngredientRecipe.find({recipe: recipeId})
      .populate('ingredient')
      .populate('unitOfMeasure')

    const costRecipe = await calculateCost(ingredientsRecipe)

    res.json({
      count: ingredientsRecipe.length, 
      data: ingredientsRecipe,
      price: costRecipe
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addIngredientsToRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const { ingredients } = req.body;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'Ingredients should be an array' });
    }
    
    const createdIngredients = await Promise.all(ingredients.map(async (ingredientData) => {
      const { ingredientId, unitOfMeasureId, quantity } = ingredientData;

      const unitOfMeasure = await UnitOfMeasure.findById(unitOfMeasureId);
      const ingredient = await Ingredient.findById(ingredientId);

      if (!ingredient || !unitOfMeasure) {
        return res.status(404).json({ message: `Ingredient or unit of measure not found ${unitOfMeasureId} ${ingredientId}` });
      }

      const ingredientRecipe = new IngredientRecipe({
        recipe: recipeId,
        ingredient: ingredient._id,
        quantity: quantity,
        unitOfMeasure: unitOfMeasure._id,
      });
      return await ingredientRecipe.save();
    }));
    res.status(201).json(createdIngredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateIngredientsForRecipe = async (request, response) => {
  try {
    const { id } = request.params;
    const { ingredients } = request.body;
    const updatedIngredients = await Promise.all(ingredients.map(async (ingredientData) => {
      const { ingredientName, quantity, unitOfMeasureUnit } = ingredientData;

      const unitOfMeasure = await UnitOfMeasure.findOne({ unit: unitOfMeasureUnit });
      const ingredient = await Ingredient.findOne({ name: ingredientName });

      if (!ingredient || !unitOfMeasure) {
        return res.status(404).json({ message: 'Ingredient or unit of measure not found' });
      }

      const updatedIngredient = await IngredientRecipe.findOneAndUpdate(
        { recipe: id, ingredient: ingredient }, // Critério de busca
        { quantity, unitOfMeasure }, // Novos dados do ingrediente
        { new: true } // Retorna o novo documento atualizado
      );

      return updatedIngredient;
    }));

    response.status(200).json({ message: 'Ingredients updated successfully', updatedIngredients });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};

const deleteOneIngredientRecipe = async (req, resp) => {
  try {
    const { recipeId, id } = req.params;

    IngredientRecipe.deleteOne({ ingredient: id, recipe: recipeId })
    .then((result) => {
      console.log(`${result} removed with sucess!`);
    })
    .catch((error) => {
      console.error('Error to remove document:', error);
    });

    return resp.status(200).send({ message: 'Ingredient Recipe deleted successfully' });
  } catch (error) {
    console.log(error.message);
    resp.status(500).send({ message: error.message });
  }
};

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

module.exports = {
  getAllIngredientsRecipe,
  addIngredientsToRecipe,
  updateIngredientsForRecipe,
  deleteOneIngredientRecipe
};
