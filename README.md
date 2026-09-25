# BakeSmart API

> Recipe production-cost API — ingredients, categories and units of measure in, recipe cost out.

BakeSmart API helps small culinary entrepreneurs and cooking enthusiasts manage the production costs of their recipes. It lets you register ingredients, their package price and unit of measure, then combine them into recipes. The API automatically converts units (kilograms to grams, liters to milliliters) and computes the total production cost of a recipe, so you can set a competitive selling price.

## Live demo

The API is deployed and documented with Swagger UI:

**https://bakesmart-api-node-swagger.onrender.com**

## Features

- **Ingredients** — create, update, delete and retrieve ingredients with package quantity, price, category and unit of measure.
- **Unified response envelopes** — list endpoints return `{ count, data }`; single resources return the plain object.
- **Automatic cost calculation** — recipe cost is derived from each ingredient's package price/quantity, converting units when needed (kg↔g, L↔mL).
- **Categories & units of measure** — organize ingredients and keep calculations consistent.
- **Swagger documentation** — interactive OpenAPI docs served at the API root.

## Tech stack

- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [Jest](https://jestjs.io/) for testing
- [swagger-autogen](https://github.com/davibaltar/swagger-autogen) + [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)

## Quickstart

Clone, install, configure and run:

```bash
git clone git@github.com:kauanatomb/BakeSmart-Api-Node-Swagger.git
cd BakeSmart-Api-Node-Swagger
npm install
cp .env.example .env
npm start
```

Open **http://localhost:3000** to access the Swagger UI and try the endpoints.

### Environment variables

| Variable        | Description                | Default                                 |
| --------------- | -------------------------- | --------------------------------------- |
| `MONGODB_URI` | MongoDB connection string  | `mongodb://127.0.0.1:27017/bakesmart` |
| `PORT`        | Port the server listens on | `3000`                                |

## Endpoint reference

### Category

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| GET    | `/categories` | List all categories |
| POST   | `/categories` | Create a category   |

### UnitOfMeasure

| Method | Endpoint            | Description                                        |
| ------ | ------------------- | -------------------------------------------------- |
| GET    | `/unitofmeasures` | List all units of measure                          |
| POST   | `/unitofmeasures` | Create a unit of measure (abbreviation is derived) |

### Ingredient

| Method | Endpoint              | Description                                                  |
| ------ | --------------------- | ------------------------------------------------------------ |
| GET    | `/ingredients`      | List all ingredients                                         |
| POST   | `/ingredients`      | Create an ingredient (category and unit are matched by name) |
| GET    | `/ingredients/{id}` | Get a single ingredient                                      |
| PUT    | `/ingredients/{id}` | Update an ingredient                                         |
| DELETE | `/ingredients/{id}` | Delete an ingredient and remove its references from recipes  |

### Recipe

| Method | Endpoint          | Description                                               |
| ------ | ----------------- | --------------------------------------------------------- |
| GET    | `/recipes`      | List all recipes with their ingredients                   |
| POST   | `/recipes`      | Create a recipe                                           |
| GET    | `/recipes/{id}` | Get a recipe with its ingredients and the calculated cost |
| PUT    | `/recipes/{id}` | Update a recipe                                           |
| DELETE | `/recipes/{id}` | Delete a recipe and all of its ingredient links           |

### Recipe Ingredients

| Method | Endpoint                                 | Description                                    |
| ------ | ---------------------------------------- | ---------------------------------------------- |
| POST   | `/recipes/{recipeId}/ingredients`      | Link ingredients to a recipe                   |
| GET    | `/recipes/{recipeId}/ingredients`      | List a recipe's ingredients and total price    |
| PUT    | `/recipes/{recipeId}/ingredients`      | Update the quantity/unit of linked ingredients |
| DELETE | `/recipes/{recipeId}/ingredients/{id}` | Remove one ingredient link from a recipe       |

## Example request flow

A minimal end-to-end chain. Replace `{id}` placeholders with the `_id` values returned by each response.

**1. Create a category**

```bash
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Flours"}'
```

**2. Create a unit of measure**

```bash
curl -X POST http://localhost:3000/unitofmeasures \
  -H "Content-Type: application/json" \
  -d '{"unit":"Grams"}'
```

**3. Create an ingredient** (a 1 kg bag of flour costs R$ 6.50)

```bash
curl -X POST http://localhost:3000/ingredients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wheat Flour",
    "quantity": 1000,
    "brand": "Dona Benta",
    "category": "Flours",
    "unitOfMeasure": "Grams",
    "price": 6.5
  }'
```

**4. Create a recipe**

```bash
curl -X POST http://localhost:3000/recipes \
  -H "Content-Type: application/json" \
  -d '{"name":"Chocolate Cake","description":"Rich and moist chocolate cake","cookTime":"1 hour and 30 minutes"}'
```

**5. Link an ingredient to the recipe** (use 250 g of flour)

```bash
curl -X POST http://localhost:3000/recipes/{recipeId}/ingredients \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": [
      {"ingredientId": "{ingredientId}", "unitOfMeasureId": "{unitOfMeasureId}", "quantity": 250}
    ]
  }'
```

**6. Read the recipe and its computed cost**

```bash
curl http://localhost:3000/recipes/{recipeId}
```

```json
{
  "_id": "...",
  "name": "Chocolate Cake",
  "description": "Rich and moist chocolate cake",
  "cookTime": "1 hour and 30 minutes",
  "ingredients": [
    {
      "_id": "...",
      "name": "Wheat Flour",
      "quantity": 250,
      "unitOfMeasure": { "_id": "...", "unit": "Grams" }
    }
  ],
  "costRecipe": 1.63
}
```

**Error example** — referencing a category that does not exist returns `404`:

```bash
curl -X POST http://localhost:3000/ingredients \
  -H "Content-Type: application/json" \
  -d '{"name":"Rice","quantity":1,"brand":"Tio Joao","category":"Grains","unitOfMeasure":"Unit","price":5}'
```

```json
{ "message": "Category 'Grains' not found." }
```

## Testing

```bash
npm test
```

6 test suites, 57 tests, ~96% statement coverage (controllers, services and models, with all database access mocked).

## Swagger documentation workflow

The API structure (endpoints and HTTP methods) in `swagger_documentation.json` is generated from the route files so it never drifts from the code:

```bash
npm run doc
```

The semantic content  `info`, `tags`, definitions, endpoint summaries, parameters, responses and examples is hand-written directly into `swagger_documentation.json` after generation, so the documentation reflects exactly how the API behaves.
