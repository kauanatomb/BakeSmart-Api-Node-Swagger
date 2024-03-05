import { getAllUnitOfMeasures, createUnitOfMeasure } from '../controllers/unitOfMeasureController';
import { UnitOfMeasure } from '../models/unitOfMeasureModel';

jest.mock('../models/unitOfMeasureModel', () => ({
  UnitOfMeasure: {
    find: jest.fn(),
    create: jest.fn(),
  },
}));

describe('UnitOfMeasure Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUnitOfMeasures', () => {
    it('should get all units of measure', async () => {
      const mockUnitOfMeasures = [{ unit: 'Unit1', abbreviation: 'U1' }, { unit: 'Unit2', abbreviation: 'U2' }];
      UnitOfMeasure.find.mockResolvedValue(mockUnitOfMeasures);

      const req = {};
      const res = {
        json: jest.fn(),
      };

      await getAllUnitOfMeasures(req, res);

      expect(UnitOfMeasure.find).toHaveBeenCalledWith({}, 'unit abbreviation');
      expect(res.json).toHaveBeenCalledWith({
        count: mockUnitOfMeasures.length,
        data: mockUnitOfMeasures,
      });
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
      const newUnitOfMeasure = { unit: 'NewUnit', abbreviation: 'NU' };
      UnitOfMeasure.create.mockResolvedValue(newUnitOfMeasure);

      const req = { body: { unit: 'NewUnit' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createUnitOfMeasure(req, res);

      expect(UnitOfMeasure.create).toHaveBeenCalledWith({ unit: 'NewUnit' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newUnitOfMeasure);
    });

    it('should handle errors when creating unit of measure', async () => {
      const errorMessage = 'Error creating unit of measure';
      UnitOfMeasure.create.mockRejectedValue(new Error(errorMessage));

      const req = { body: { unit: 'NewUnit' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createUnitOfMeasure(req, res);

      expect(UnitOfMeasure.create).toHaveBeenCalledWith({ unit: 'NewUnit' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
