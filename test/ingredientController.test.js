// import { getAllIngredients, createIngredient, updateIngredient } from '../controllers/ingredientController';
// import { Ingredient } from '../models/ingredientModel';
// import { Category } from '../models/categoryModel';
// import { UnitOfMeasure } from '../models/unitOfMeasureModel';

// jest.mock('../models/ingredientModel', () => ({
//   Ingredient: {
//     find: jest.fn(),
//     create: jest.fn(),
//     findByIdAndUpdate: jest.fn(),
//   },
// }));

// // jest.mock('../models/categoryModel', () => ({
// //   Category: {
// //     findOne: jest.fn(),
// //   },
// // }));

// // jest.mock('../models/unitOfMeasureModel', () => ({
// //   UnitOfMeasure: {
// //     findOne: jest.fn(),
// //   },
// // }));

// describe('Ingredient Controller', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('getAllIngredients', () => {
//     it('should get all ingredients', async () => {
//       const mockIngredients = [
//         { name: 'Ingredient1', quantity: 1, brand: 'Brand1', price: "1 real", idCategory: "id", idUnitOfMeasure: "id" },
//         { name: 'Ingredient2', quantity: 2, brand: 'Brand2', price: "50 reais", idCategory: "id", idUnitOfMeasure: "id" },
//       ];
//       Ingredient.find.mockResolvedValue(mockIngredients);

//       const req = {};
//       const res = {
//         json: jest.fn(),
//       };

//       await getAllIngredients(req, res);

//       expect(Ingredient.find).toHaveBeenCalled();
//       expect(res.json).toHaveBeenCalledWith({
//         count: mockIngredients.length,
//         data: mockIngredients,
//       });
//     });

//     it('should handle errors', async () => {
//       const errorMessage = 'Error retrieving ingredients';
//       Ingredient.find.mockRejectedValue(new Error(errorMessage));

//       const req = {};
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       await getAllIngredients(req, res);

//       expect(Ingredient.find).toHaveBeenCalled();
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
//     });
//   });

  // describe('createIngredient', () => {
  //   afterEach(() => {
  //     jest.clearAllMocks();
  //   });
  
  //   it('should create a new ingredient when category and unit of measure are found', async () => {
  //     const req = {
  //       body: {
  //         name: 'IngredientName',
  //         quantity: 1,
  //         brand: 'IngredientBrand',
  //         idCategory: 'CategoryName',
  //         idUnitOfMeasure: 'UnitOfMeasureUnit',
  //         price: 10,
  //       },
  //     };
  
  //     const mockCategory = { _id: 'categoryId' };
  //     const mockUnitOfMeasure = { _id: 'unitOfMeasureId' };
  //     const mockCreatedIngredient = { _id: 'createdIngredientId' };
  
  //     Category.findOne.mockResolvedValue(mockCategory);
  //     UnitOfMeasure.findOne.mockResolvedValue(mockUnitOfMeasure);
  //     Ingredient.create.mockResolvedValue(mockCreatedIngredient);
  
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };
  
  //     await createIngredient(req, res);
  
  //     expect(Category.findOne).toHaveBeenCalledWith({ name: req.body.idCategory });
  //     expect(UnitOfMeasure.findOne).toHaveBeenCalledWith({ unit: req.body.idUnitOfMeasure });
  //     expect(Ingredient.create).toHaveBeenCalledWith({
  //       name: req.body.name,
  //       quantity: req.body.quantity,
  //       brand: req.body.brand,
  //       idCategory: mockCategory._id,
  //       idUnitOfMeasure: mockUnitOfMeasure._id,
  //       price: req.body.price,
  //     });
  //     expect(res.status).toHaveBeenCalledWith(201);
  //     expect(res.json).toHaveBeenCalledWith(mockCreatedIngredient);
  //   });
  
  //   it('should return error when category is not found', async () => {
  //     // Simular quando a categoria não é encontrada
  
  //     const req = {
  //       body: {
  //       },
  //     };
  
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };
  
  //     await createIngredient(req, res);
  
  //     // Verificar se o status e a mensagem de erro são retornados corretamente
  //   });
  
  //   it('should return error when unit of measure is not found', async () => {
  //     // Simular quando a unidade de medida não é encontrada
  
  //     const req = {
  //       body: {
  //       },
  //     };
  
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };
  
  //     await createIngredient(req, res);
  
  //     // Verificar se o status e a mensagem de erro são retornados corretamente
  //   });
  
  //   it('should return error when ingredient creation fails', async () => {
  //     // Simular quando a criação de ingrediente falha
  
  //     const req = {
  //       body: {
  //       },
  //     };
  
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };
  
  //     await createIngredient(req, res);
  //     // mensagem de erro retorna?
  //   });
  // });

  // describe('updateIngredient', () => {
  //   // testes para update
  // });
// });
