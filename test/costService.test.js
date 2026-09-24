const { convertUnitOfMeasure, calculateCost } = require('../services/costService');
const Ingredient = require('../models/ingredientModel');

jest.mock('../models/ingredientModel');

describe('convertUnitOfMeasure', () => {
  it('returns the quantity unchanged when units are equal', () => {
    expect(convertUnitOfMeasure(10, 'Grams', 'Grams')).toBe(10);
  });

  it('converts Kilogram to Grams', () => {
    expect(convertUnitOfMeasure(0.5, 'Kilogram', 'Grams')).toBe(500);
  });

  it('converts Grams to Kilogram', () => {
    expect(convertUnitOfMeasure(250, 'Grams', 'Kilogram')).toBe(0.25);
  });

  it('converts Liter to Milliliter', () => {
    expect(convertUnitOfMeasure(2, 'Liter', 'Milliliter')).toBe(2000);
  });

  it('converts Milliliter to Liter', () => {
    expect(convertUnitOfMeasure(500, 'Milliliter', 'Liter')).toBe(0.5);
  });

  it('throws on incompatible units', () => {
    expect(() => convertUnitOfMeasure(1, 'Kilogram', 'Liter')).toThrow('Incompatible units for conversion');
  });
});

describe('calculateCost', () => {
  const mockIngredientFind = (ingredients) => {
    Ingredient.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(ingredients),
      }),
    });
  };

  it('calculates cost when recipe and ingredient use the same unit', async () => {
    mockIngredientFind([
      { _id: 'ing1', quantity: 500, price: 5, unitOfMeasure: { unit: 'Grams' } },
    ]);

    const ingredientsRecipe = [
      { ingredient: 'ing1', quantity: 100, unitOfMeasure: { unit: 'Grams' } },
    ];

    const total = await calculateCost(ingredientsRecipe);

    expect(total).toBe(1);
  });

  it('converts the recipe quantity to the ingredient purchase unit before costing', async () => {
    mockIngredientFind([
      { _id: 'ing1', quantity: 1, price: 10, unitOfMeasure: { unit: 'Kilogram' } },
    ]);

    const ingredientsRecipe = [
      { ingredient: { _id: 'ing1', name: 'Flour' }, quantity: 250, unitOfMeasure: { unit: 'Grams' } },
    ];

    const total = await calculateCost(ingredientsRecipe);

    expect(total).toBe(2.5);
  });

  it('sums the cost of multiple ingredients', async () => {
    mockIngredientFind([
      { _id: 'ing1', quantity: 500, price: 5, unitOfMeasure: { unit: 'Grams' } },
      { _id: 'ing2', quantity: 2, price: 3, unitOfMeasure: { unit: 'Liter' } },
    ]);

    const ingredientsRecipe = [
      { ingredient: 'ing1', quantity: 500, unitOfMeasure: { unit: 'Grams' } },
      { ingredient: 'ing2', quantity: 1, unitOfMeasure: { unit: 'Liter' } },
    ];

    const total = await calculateCost(ingredientsRecipe);

    expect(total).toBe(6.5);
  });
});