const { getAllCategories, createCategory } = require('../controllers/categoryController');
const { Category } = require('../models/categoryModel');

jest.mock('../models/categoryModel', () => ({
  Category: {
    find: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Category Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('should get all categories', async () => {
      const mockCategories = [{ name: 'Category1' }, { name: 'Category2' }];
      Category.find.mockResolvedValue(mockCategories);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getAllCategories(req, res);

      expect(Category.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        count: mockCategories.length,
        data: mockCategories,
      });
    });

    it('should handle errors', async () => {
      const errorMessage = 'Error retrieving categories';
      Category.find.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getAllCategories(req, res);

      expect(Category.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const newCategory = { name: 'NewCategory' };
      Category.create.mockResolvedValue(newCategory);

      const req = { body: newCategory };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await createCategory(req, res);

      expect(Category.create).toHaveBeenCalledWith(newCategory);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newCategory);
    });

    it('should handle errors when creating category', async () => {
      const errorMessage = 'Error creating category';
      const newCategory = { name: 'NewCategory' };
      Category.create.mockRejectedValue(new Error(errorMessage));

      const req = { body: newCategory };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await createCategory(req, res);

      expect(Category.create).toHaveBeenCalledWith(newCategory);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
