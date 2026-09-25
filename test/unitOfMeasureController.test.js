const { getAllUnitOfMeasures, createUnitOfMeasure } = require('../controllers/unitOfMeasureController');

jest.mock('../models/unitOfMeasureModel', () => ({
  find: jest.fn(),
  create: jest.fn(),
}));

const UnitOfMeasure = require('../models/unitOfMeasureModel');

describe('UnitOfMeasure Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUnitOfMeasures', () => {
    it('should return all units of measure', async () => {
      const mockUnitOfMeasures = [
        { _id: '1', unit: 'Kilogram', abbreviation: 'kg' },
        { _id: '2', unit: 'Grams', abbreviation: 'g' },
      ];
      UnitOfMeasure.find.mockResolvedValue(mockUnitOfMeasures);

      const req = {};
      const res = { json: jest.fn() };

      await getAllUnitOfMeasures(req, res);

      expect(UnitOfMeasure.find).toHaveBeenCalledWith({}, 'unit abbreviation');
      expect(res.json).toHaveBeenCalledWith({ count: 2, data: mockUnitOfMeasures });
    });

    it('should handle errors', async () => {
      const errorMessage = 'Error retrieving units of measure';
      UnitOfMeasure.find.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllUnitOfMeasures(req, res);

      expect(UnitOfMeasure.find).toHaveBeenCalledWith({}, 'unit abbreviation');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('createUnitOfMeasure', () => {
    it('should create a new unit of measure', async () => {
      const newUnitOfMeasure = { _id: '1', unit: 'Grams', abbreviation: 'g' };
      UnitOfMeasure.create.mockResolvedValue(newUnitOfMeasure);

      const req = { body: { unit: 'Grams' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createUnitOfMeasure(req, res);

      expect(UnitOfMeasure.create).toHaveBeenCalledWith({ unit: 'Grams' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newUnitOfMeasure);
    });

    it('should handle errors when creating unit of measure', async () => {
      const errorMessage = 'Error creating unit of measure';
      UnitOfMeasure.create.mockRejectedValue(new Error(errorMessage));

      const req = { body: { unit: 'Grams' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createUnitOfMeasure(req, res);

      expect(UnitOfMeasure.create).toHaveBeenCalledWith({ unit: 'Grams' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});