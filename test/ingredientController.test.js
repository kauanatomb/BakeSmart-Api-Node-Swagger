const { getAllIngredients, createIngredient, updateIngredient, deleteOneIngredient, getOneIngredient } = require('../controllers/ingredientController');

jest.mock('../models/ingredientModel', () => ({
  find: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

jest.mock('../models/categoryModel', () => ({
  findOne: jest.fn(),
}));

jest.mock('../models/unitOfMeasureModel', () => ({
  findOne: jest.fn(),
}));

jest.mock('../models/ingredientRecipeModel', () => ({
  deleteMany: jest.fn(),
}));

const Ingredient = require('../models/ingredientModel');
const Category = require('../models/categoryModel');
const UnitOfMeasure = require('../models/unitOfMeasureModel');
const IngredientRecipe = require('../models/ingredientRecipeModel');

const ingredientPayload = {
  name: 'Wheat Flour',
  quantity: 500,
  brand: 'Dona Benta',
  category: 'Flours',
  unitOfMeasure: 'Grams',
  price: 8.5,
};

const createdIngredient = {
  _id: 'ing1',
  name: 'Wheat Flour',
  quantity: 500,
  brand: 'Dona Benta',
  price: 8.5,
};

const chain = (first, second) => ({
  populate: jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnValue(second),
  }),
});

describe('Ingredient Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllIngredients', () => {
    it('should return all ingredients', async () => {
      const mockIngredients = [{ name: 'Wheat Flour' }];
      Ingredient.find.mockReturnValue(chain('category', mockIngredients));

      const req = {};
      const res = { json: jest.fn() };

      await getAllIngredients(req, res);

      expect(Ingredient.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({ count: 1, data: mockIngredients });
    });

    it('should forward errors to the error handler', async () => {
      const error = new Error('DB down');
      Ingredient.find.mockReturnValue(
        chain('category', Promise.reject(error))
      );

      const req = {};
      const res = {};
      const next = jest.fn();

      await getAllIngredients(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createIngredient', () => {
    it('should return 400 when required fields are missing', async () => {
      const req = { body: { name: 'Wheat Flour' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createIngredient(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'All fields are required: name, quantity, brand, category, unitOfMeasure, price',
      });
    });

    it('should return 404 when the category is not found', async () => {
      Category.findOne.mockResolvedValue(null);

      const req = { body: ingredientPayload };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createIngredient(req, res);

      expect(Category.findOne).toHaveBeenCalledWith({ name: 'Flours' });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Category 'Flours' not found." });
    });

    it('should return 404 when the unit of measure is not found', async () => {
      Category.findOne.mockResolvedValue({ _id: 'cat1' });
      UnitOfMeasure.findOne.mockResolvedValue(null);

      const req = { body: ingredientPayload };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createIngredient(req, res);

      expect(UnitOfMeasure.findOne).toHaveBeenCalledWith({ unit: 'Grams' });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Unit of measure 'Grams' not found." });
    });

    it('should create an ingredient and return it', async () => {
      Category.findOne.mockResolvedValue({ _id: 'cat1' });
      UnitOfMeasure.findOne.mockResolvedValue({ _id: 'uom1' });
      Ingredient.create.mockResolvedValue(createdIngredient);

      const req = { body: ingredientPayload };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createIngredient(req, res);

      expect(Ingredient.create).toHaveBeenCalledWith({
        name: 'Wheat Flour',
        quantity: 500,
        brand: 'Dona Benta',
        category: 'cat1',
        unitOfMeasure: 'uom1',
        price: 8.5,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdIngredient);
    });

    it('should forward errors to the error handler', async () => {
      const error = new Error('DB down');
      Category.findOne.mockRejectedValue(error);

      const req = { body: ingredientPayload };
      const res = {};
      const next = jest.fn();

      await createIngredient(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateIngredient', () => {
    it('should return 400 when category or unit of measure is missing', async () => {
      const req = { params: { id: 'ing1' }, body: { name: 'Wheat Flour' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateIngredient(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Category and unit of measure are required' });
    });

    it('should return 404 when the unit of measure is not found', async () => {
      UnitOfMeasure.findOne.mockResolvedValue(null);

      const req = { params: { id: 'ing1' }, body: ingredientPayload };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateIngredient(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Unit of measure 'Grams' not found." });
    });

    it('should return 404 when the category is not found', async () => {
      UnitOfMeasure.findOne.mockResolvedValue({ _id: 'uom1' });
      Category.findOne.mockResolvedValue(null);

      const req = { params: { id: 'ing1' }, body: ingredientPayload };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateIngredient(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Category 'Flours' not found." });
    });

    it('should update an ingredient and return it', async () => {
      UnitOfMeasure.findOne.mockResolvedValue({ _id: 'uom1' });
      Category.findOne.mockResolvedValue({ _id: 'cat1' });
      Ingredient.findByIdAndUpdate.mockResolvedValue(createdIngredient);

      const req = { params: { id: 'ing1' }, body: ingredientPayload };
      const res = { json: jest.fn() };

      await updateIngredient(req, res);

      expect(Ingredient.findByIdAndUpdate).toHaveBeenCalledWith(
        'ing1',
        {
          name: 'Wheat Flour',
          quantity: 500,
          brand: 'Dona Benta',
          category: 'cat1',
          unitOfMeasure: 'uom1',
          price: 8.5,
        },
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith(createdIngredient);
    });

    it('should return 404 when the ingredient does not exist', async () => {
      UnitOfMeasure.findOne.mockResolvedValue({ _id: 'uom1' });
      Category.findOne.mockResolvedValue({ _id: 'cat1' });
      Ingredient.findByIdAndUpdate.mockResolvedValue(null);

      const req = { params: { id: 'missing' }, body: ingredientPayload };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateIngredient(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ingredient not found' });
    });

    it('should forward errors to the error handler', async () => {
      const error = new Error('DB down');
      UnitOfMeasure.findOne.mockRejectedValue(error);

      const req = { params: { id: 'ing1' }, body: ingredientPayload };
      const res = {};
      const next = jest.fn();

      await updateIngredient(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteOneIngredient', () => {
    it('should delete an ingredient and its recipe references', async () => {
      Ingredient.findByIdAndDelete.mockResolvedValue({ _id: 'ing1' });
      IngredientRecipe.deleteMany.mockResolvedValue({});

      const req = { params: { id: 'ing1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await deleteOneIngredient(req, res);

      expect(Ingredient.findByIdAndDelete).toHaveBeenCalledWith('ing1');
      expect(IngredientRecipe.deleteMany).toHaveBeenCalledWith({ ingredient: 'ing1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Ingredient deleted successfully' });
    });

    it('should return 404 when the ingredient does not exist', async () => {
      Ingredient.findByIdAndDelete.mockResolvedValue(null);

      const req = { params: { id: 'missing' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteOneIngredient(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ingredient not found' });
    });
  });

  describe('getOneIngredient', () => {
    it('should return a single ingredient', async () => {
      Ingredient.findById.mockReturnValue(chain('category', createdIngredient));

      const req = { params: { id: 'ing1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getOneIngredient(req, res);

      expect(Ingredient.findById).toHaveBeenCalledWith('ing1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(createdIngredient);
    });

    it('should return 404 when the ingredient does not exist', async () => {
      Ingredient.findById.mockReturnValue(chain('category', null));

      const req = { params: { id: 'missing' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getOneIngredient(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ingredient not found' });
    });
  });
});