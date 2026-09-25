const { createRecipe, getAllRecipes, getOneRecipe, updateOneRecipe, deleteOneRecipe } = require('../controllers/recipeController');

jest.mock('../models/recipeModel', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

jest.mock('../models/ingredientRecipeModel', () => ({
  find: jest.fn(),
  deleteMany: jest.fn(),
}));

jest.mock('../services/costService', () => ({
  calculateCost: jest.fn(),
}));

const Recipe = require('../models/recipeModel');
const IngredientRecipe = require('../models/ingredientRecipeModel');
const { calculateCost } = require('../services/costService');

const recipeModel = {
  _id: '1',
  name: 'Chocolate Cake',
  description: 'Rich and moist chocolate cake',
  cookTime: '1 hour and 30 minutes',
};

const ingredientLink = {
  recipe: '1',
  ingredient: { _id: 'ing1', name: 'Wheat Flour' },
  quantity: 250,
  unitOfMeasure: { _id: '2', unit: 'Grams' },
};

describe('Recipe Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRecipe', () => {
    it('should create a new recipe and return it', async () => {
      Recipe.create.mockResolvedValue(recipeModel);

      const req = {
        body: { name: 'Chocolate Cake', description: 'Rich and moist chocolate cake', cookTime: '1 hour and 30 minutes' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await createRecipe(req, res);

      expect(Recipe.create).toHaveBeenCalledWith({
        name: 'Chocolate Cake',
        description: 'Rich and moist chocolate cake',
        cookTime: '1 hour and 30 minutes',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(recipeModel);
    });

    it('should return 400 when name or description is missing', async () => {
      const req = { body: { name: 'Chocolate Cake' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await createRecipe(req, res);

      expect(Recipe.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'Name and description are required' });
    });

    it('should forward errors to the error handler', async () => {
      const error = new Error('DB down');
      Recipe.create.mockRejectedValue(error);

      const req = { body: { name: 'Cake', description: 'Yummy' } };
      const res = {};
      const next = jest.fn();

      await createRecipe(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllRecipes', () => {
    it('should return recipes with ingredients in a count/data', async () => {
      const recipes = [recipeModel];
      const ingredientLinks = [ingredientLink];

      Recipe.find.mockReturnValue({ lean: jest.fn().mockResolvedValue(recipes) });
      IngredientRecipe.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(ingredientLinks),
      });

      const req = {};
      const res = { json: jest.fn() };

      await getAllRecipes(req, res);

      expect(Recipe.find).toHaveBeenCalledWith({});
      expect(IngredientRecipe.find).toHaveBeenCalledWith({ recipe: { $in: ['1'] } });
      expect(res.json).toHaveBeenCalledWith({
        count: 1,
        data: [
          {
            _id: '1',
            name: 'Chocolate Cake',
            description: 'Rich and moist chocolate cake',
            cookTime: '1 hour and 30 minutes',
            ingredients: [
              {
                _id: 'ing1',
                name: 'Wheat Flour',
                quantity: 250,
                unitOfMeasure: { _id: '2', unit: 'Grams' },
              },
            ],
          },
        ],
      });
    });
  });

  describe('getOneRecipe', () => {
    it('should return a single recipe with its cost', async () => {
      Recipe.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue(recipeModel) });
      IngredientRecipe.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([ingredientLink]),
      });
      calculateCost.mockResolvedValue(12.5);

      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getOneRecipe(req, res);

      expect(Recipe.findById).toHaveBeenCalledWith('1');
      expect(calculateCost).toHaveBeenCalledWith([ingredientLink]);
      expect(res.json).toHaveBeenCalledWith({
        _id: '1',
        name: 'Chocolate Cake',
        description: 'Rich and moist chocolate cake',
        cookTime: '1 hour and 30 minutes',
        ingredients: [
          {
            _id: 'ing1',
            name: 'Wheat Flour',
            quantity: 250,
            unitOfMeasure: { _id: '2', unit: 'Grams' },
          },
        ],
        costRecipe: 12.5,
      });
    });

    it('should return 404 when the recipe does not exist', async () => {
      Recipe.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

      const req = { params: { id: 'missing' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getOneRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
    });
  });

  describe('updateOneRecipe', () => {
    it('should update a recipe and return it', async () => {
      Recipe.findByIdAndUpdate.mockResolvedValue(recipeModel);

      const req = { params: { id: '1' }, body: { name: 'New Name' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateOneRecipe(req, res);

      expect(Recipe.findByIdAndUpdate).toHaveBeenCalledWith('1', { name: 'New Name' }, { new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Recipe updated successfully', updatedRecipe: recipeModel });
    });

    it('should return 404 when the recipe does not exist', async () => {
      Recipe.findByIdAndUpdate.mockResolvedValue(null);

      const req = { params: { id: 'missing' }, body: { name: 'New Name' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateOneRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
    });
  });

  describe('deleteOneRecipe', () => {
    it('should delete a recipe and its ingredient links', async () => {
      Recipe.findByIdAndDelete.mockResolvedValue(recipeModel);
      IngredientRecipe.deleteMany.mockResolvedValue({});

      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await deleteOneRecipe(req, res);

      expect(Recipe.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(IngredientRecipe.deleteMany).toHaveBeenCalledWith({ recipe: '1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Recipe deleted successfully' });
    });

    it('should return 404 when the recipe does not exist', async () => {
      Recipe.findByIdAndDelete.mockResolvedValue(null);

      const req = { params: { id: 'missing' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteOneRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
    });
  });
});