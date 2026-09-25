const { getAllCategories, createCategory } = require('../controllers/categoryController');

jest.mock('../models/categoryModel', () => ({
  find: jest.fn(),
  create: jest.fn(),
}));

const Category = require('../models/categoryModel');

describe('Category Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const mockCategories = [{ _id: '1', name: 'Flours' }, { _id: '2', name: 'Sweeteners' }];
      Category.find.mockResolvedValue(mockCategories);

      const req = {};
      const res = { json: jest.fn() };

      await getAllCategories(req, res);

      expect(Category.find).toHaveBeenCalledWith({}, 'name');
      expect(res.json).toHaveBeenCalledWith({ count: 2, data: mockCategories });
    });

    it('should handle errors', async () => {
      const errorMessage = 'Error retrieving categories';
      Category.find.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const newCategory = { _id: '1', name: 'Flours' };
      Category.create.mockResolvedValue(newCategory);

      const req = { body: { name: 'Flours' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createCategory(req, res);

      expect(Category.create).toHaveBeenCalledWith({ name: 'Flours' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newCategory);
    });

    it('should handle errors when creating category', async () => {
      const errorMessage = 'Error creating category';
      Category.create.mockRejectedValue(new Error(errorMessage));

      const req = { body: { name: 'Flours' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});