import {
  createRecipe,
  getAllRecipes,
  getOneRecipe,
  updateOneRecipe,
  deleteOneRecipe,
} from '../controllers/recipeController';
import { Recipe } from '../models/recipeModel';
import { IngredientRecipe } from '../models/ingredientRecipeModel';

jest.mock('../models/recipeModel');
jest.mock('../models/ingredientRecipeModel');

describe('Recipe Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new recipe', async () => {
    const newRecipe = { name: 'Recipe1', description: 'Description1', cookTime: 30 };
    const mockCreate = jest.spyOn(Recipe, 'create').mockResolvedValue(newRecipe);

    const req = { body: newRecipe };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await createRecipe(req, res);

    expect(mockCreate).toHaveBeenCalledWith(newRecipe);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(newRecipe);
  });

  it('should get all recipes with ingredients', async () => {
    const mockRecipes = [{ _id: '1', name: 'Recipe1' }, { _id: '2', name: 'Recipe2' }];
    const mockIngredients = [
      { _id: '1', name: 'Ingredient1' },
      { _id: '2', name: 'Ingredient2' },
    ];
    const mockFind = jest.spyOn(Recipe, 'find').mockResolvedValue(mockRecipes);
    const mockIngredientFind = jest
      .spyOn(IngredientRecipe, 'find')
      .mockResolvedValue(mockIngredients);

    const req = {};
    const res = {
      json: jest.fn(),
    };

    await getAllRecipes(req, res);

    expect(mockFind).toHaveBeenCalled();
    expect(mockIngredientFind).toHaveBeenCalledWith({ recipe: '1' });
    expect(mockIngredientFind).toHaveBeenCalledWith({ recipe: '2' });
    expect(res.json).toHaveBeenCalledWith({
      data: [
        { recipe: mockRecipes[0], ingredients: mockIngredients },
        { recipe: mockRecipes[1], ingredients: mockIngredients },
      ],
    });
  });

  //(getOneRecipe, updateOneRecipe, deleteOneRecipe)
});
