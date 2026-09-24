const Ingredient = require('../models/ingredientModel');

const CONVERSION_FACTORS = {
  Kilogram: { Grams: 1000 },
  Grams: { Kilogram: 1 / 1000 },
  Liter: { Milliliter: 1000 },
  Milliliter: { Liter: 1 / 1000 },
};

function convertUnitOfMeasure(quantity, fromUnit, toUnit) {
  if (fromUnit === toUnit) {
    return quantity;
  }

  const factor = CONVERSION_FACTORS[fromUnit] && CONVERSION_FACTORS[fromUnit][toUnit];

  if (factor === undefined) {
    throw new Error(`Incompatible units for conversion ${quantity} ${fromUnit} ${toUnit}`);
  }

  return quantity * factor;
}

async function calculateCost(ingredientsRecipe) {
  const ingredientIds = ingredientsRecipe.map(({ ingredient }) =>
    ingredient && typeof ingredient === 'object' ? ingredient._id || ingredient : ingredient
  );

  const ingredients = await Ingredient.find({ _id: { $in: ingredientIds } })
    .populate('unitOfMeasure')
    .lean();

  const ingredientMap = new Map(ingredients.map((ingredient) => [String(ingredient._id), ingredient]));

  let totalCost = 0;

  for (const { ingredient, quantity, unitOfMeasure } of ingredientsRecipe) {
    const ingredientId = ingredient && typeof ingredient === 'object' ? ingredient._id || ingredient : ingredient;
    const ingredientData = ingredientMap.get(String(ingredientId));

    if (!ingredientData || !ingredientData.unitOfMeasure) {
      continue;
    }

    const recipeUnit = unitOfMeasure && unitOfMeasure.unit;
    const ingredientUnit = ingredientData.unitOfMeasure.unit;

    const convertedQuantity = convertUnitOfMeasure(quantity, recipeUnit, ingredientUnit);
    const cost = (convertedQuantity / ingredientData.quantity) * ingredientData.price;
    totalCost += cost;
  }

  return totalCost;
}

module.exports = { calculateCost, convertUnitOfMeasure };