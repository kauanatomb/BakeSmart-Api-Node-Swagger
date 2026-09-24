# BakeSmart API
## Description
BakeSmart API is a Node.js application designed to help small culinary entrepreneurs and cooking enthusiasts manage the production costs of their recipes. This API enables users to input ingredients, costs, categories, and units of measure to automatically calculate total recipe costs, helping in setting competitive selling prices and maximizing profits.

## Features
- Ingredients Management: Create, update, delete, and retrieve ingredients with unit costs and units of measure.
- Recipe Management: Create, update, delete, and retrieve recipes with ingredients, quantities, and measures.
- Category Management: Manage categories for better organization of ingredients and recipes.
- Unit of Measure Management: Manage units of measure for consistent calculations.

## API Documentation
The API is documented with Swagger and served automatically by the server using `swagger-ui-express`.

Open your browser and navigate to: http://localhost:3000

The specification file is `swagger_documentation.json`. Its **structure** (endpoints and HTTP methods) is generated from the route files so it stays in sync with the code:

```
npm run doc
```

The **semantic content** (info, tags, definitions, endpoint summaries, parameters, responses and examples) is hand-written directly in `swagger_documentation.json` after generation — so after running `npm run doc`, re-apply the hand-authored enrichment to the generated skeleton.

## Installation
Clone the repository:
```
git clone git@github.com:kauanatomb/BakeSmart-Api-Node-Swagger.git
```
Install dependencies:
```
npm install
```
Set up environment variables by copying `.env.example` to `.env` and adding your database URL:
```
cp .env.example .env
```
The supported variables are:
```
MONGODB_URI=your_database_url
PORT=3000
```

Start the server:
```
npm start
```
