const {
  getAllIngredientsRecipe,
  addIngredientsToRecipe,
  updateIngredientsForRecipe,
  deleteOneIngredientRecipe,
} = require('../controllers/ingredientRecipeController');

jest.mock('../models/ingredientRecipeModel', () => {
  const mockModel = jest.fn();
  mockModel.find = jest.fn();
  mockModel.findOneAndUpdate = jest.fn();
  mockModel.deleteOne = jest.fn();
  return mockModel;
});

jest.mock('../models/ingredientModel', () => ({
  findById: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock('../models/unitOfMeasureModel', () => ({
  findById: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock('../models/recipeModel', () => ({
  findById: jest.fn(),
}));

jest.mock('../services/costService', () => ({
  calculateCost: jest.fn(),
}));

const IngredientRecipe = require('../models/ingredientRecipeModel');
const Ingredient = require('../models/ingredientModel');
const UnitOfMeasure = require('../models/unitOfMeasureModel');
const Recipe = require('../models/recipeModel');
const { calculateCost } = require('../services/costService');

const ingredientLink = {
  _id: 'ir1',
  recipe: 'recipe1',
  ingredient: { _id: 'ing1', name: 'Wheat Flour', price: 8.5 },
  quantity: 250,
  unitOfMeasure: { _id: 'uom1', unit: 'Grams', abbreviation: 'g' },
};

const chain = (value) => ({
  populate: jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnValue(value),
  }),
});

describe('IngredientRecipe Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllIngredientsRecipe', () => {
    it('should return ingredient links with the total cost', async () => {
      IngredientRecipe.find.mockReturnValue(chain([ingredientLink]));
      calculateCost.mockResolvedValue(12.5);

      const req = { params: { recipeId: 'recipe1' } };
      const res = { json: jest.fn() };

      await getAllIngredientsRecipe(req, res);

      expect(IngredientRecipe.find).toHaveBeenCalledWith({ recipe: 'recipe1' });
      expect(calculateCost).toHaveBeenCalledWith([ingredientLink]);
      expect(res.json).toHaveBeenCalledWith({ count: 1, data: [ingredientLink], price: 12.5 });
    });

    it('should forward errors to the error handler', async () => {
      const error = new Error('DB down');
      IngredientRecipe.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue(Promise.reject(error)),
        }),
      });

      const req = { params: { recipeId: 'recipe1' } };
      const res = {};
      const next = jest.fn();

      await getAllIngredientsRecipe(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('addIngredientsToRecipe', () => {
    it('should create ingredient links and return them', async () => {
      Recipe.findById.mockResolvedValue({ _id: 'recipe1' });
      UnitOfMeasure.findById.mockResolvedValue({ _id: 'uom1' });
      Ingredient.findById.mockResolvedValue({ _id: 'ing1' });
      IngredientRecipe.mockReturnValue({
        save: jest.fn().mockResolvedValue(ingredientLink),
      });

      const req = {
        params: { recipeId: 'recipe1' },
        body: {
          ingredients: [
            { ingredientId: 'ing1', unitOfMeasureId: 'uom1', quantity: 250 },
          ],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await addIngredientsToRecipe(req, res);

      expect(Recipe.findById).toHaveBeenCalledWith('recipe1');
      expect(IngredientRecipe).toHaveBeenCalledWith({
        recipe: 'recipe1',
        ingredient: 'ing1',
        quantity: 250,
        unitOfMeasure: 'uom1',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith([ingredientLink]);
    });

    it('should return 404 when the recipe does not exist', async () => {
      Recipe.findById.mockResolvedValue(null);

      const req = { params: { recipeId: 'missing' }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await addIngredientsToRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
    });

    it('should return 400 when ingredients is not an array', async () => {
      Recipe.findById.mockResolvedValue({ _id: 'recipe1' });

      const req = { params: { recipeId: 'recipe1' }, body: { ingredients: 'nope' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await addIngredientsToRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ingredients should be an array' });
    });

    it('should return 404 when the ingredient or unit of measure is missing', async () => {
      Recipe.findById.mockResolvedValue({ _id: 'recipe1' });
      UnitOfMeasure.findById.mockResolvedValue({ _id: 'uom1' });
      Ingredient.findById.mockResolvedValue(null);

      const req = {
        params: { recipeId: 'recipe1' },
        body: {
          ingredients: [
            { ingredientId: 'ing1', unitOfMeasureId: 'uom1', quantity: 250 },
          ],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await addIngredientsToRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Ingredient or unit of measure not found for ingredient 'ing1' / unit 'uom1'",
      });
    });

    it('should forward errors to the error handler', async () => {
      const error = new Error('DB down');
      Recipe.findById.mockRejectedValue(error);

      const req = { params: { recipeId: 'recipe1' }, body: {} };
      const res = {};
      const next = jest.fn();

      await addIngredientsToRecipe(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateIngredientsForRecipe', () => {
    it('should update ingredient links and return them', async () => {
      UnitOfMeasure.findOne.mockResolvedValue({ _id: 'uom1' });
      Ingredient.findOne.mockResolvedValue({ _id: 'ing1' });
      IngredientRecipe.findOneAndUpdate.mockResolvedValue(ingredientLink);

      const req = {
        params: { recipeId: 'recipe1' },
        body: {
          ingredients: [
            { ingredientName: 'Wheat Flour', unitOfMeasureUnit: 'Grams', quantity: 200 },
          ],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateIngredientsForRecipe(req, res);

      expect(IngredientRecipe.findOneAndUpdate).toHaveBeenCalledWith(
        { recipe: 'recipe1', ingredient: 'ing1' },
        { quantity: 200, unitOfMeasure: 'uom1' },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Ingredients updated successfully',
        updatedIngredients: [ingredientLink],
      });
    });

    it('should return 400 when ingredients is empty or not an array', async () => {
      const req = { params: { recipeId: 'recipe1' }, body: { ingredients: [] } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateIngredientsForRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Ingredients should be a non-empty array',
      });
    });

    it('should return 404 when the ingredient or unit of measure is missing', async () => {
      UnitOfMeasure.findOne.mockResolvedValue(null);

      const req = {
        params: { recipeId: 'recipe1' },
        body: {
          ingredients: [
            { ingredientName: 'Wheat Flour', unitOfMeasureUnit: 'Grams', quantity: 200 },
          ],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateIngredientsForRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Ingredient 'Wheat Flour' or unit of measure 'Grams' not found",
      });
    });

    it('should return 404 when no ingredient recipe link matches', async () => {
      UnitOfMeasure.findOne.mockResolvedValue({ _id: 'uom1' });
      Ingredient.findOne.mockResolvedValue({ _id: 'ing1' });
      IngredientRecipe.findOneAndUpdate.mockResolvedValue(null);

      const req = {
        params: { recipeId: 'recipe1' },
        body: {
          ingredients: [
            { ingredientName: 'Wheat Flour', unitOfMeasureUnit: 'Grams', quantity: 200 },
          ],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateIngredientsForRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "No ingredient recipe found for recipe 'recipe1' and ingredient 'Wheat Flour'",
      });
    });
  });

  describe('deleteOneIngredientRecipe', () => {
    it('should return 200 when an ingredient link is deleted', async () => {
      IngredientRecipe.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const req = { params: { recipeId: 'recipe1', id: 'ir1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await deleteOneIngredientRecipe(req, res);

      expect(IngredientRecipe.deleteOne).toHaveBeenCalledWith({ ingredient: 'ir1', recipe: 'recipe1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Ingredient Recipe deleted successfully' });
    });

    it('should return 404 when nothing is deleted', async () => {
      IngredientRecipe.deleteOne.mockResolvedValue({ deletedCount: 0 });

      const req = { params: { recipeId: 'recipe1', id: 'missing' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteOneIngredientRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ingredient Recipe not found' });
    });
  });
});