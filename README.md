## Therapy Platform Backend API

### After cloning do:

```
npm i
npm run dev
```

Create .env file:

```
PORT=3000
MONGO_URI=your_mongo_db_secret_link
BASE_URL=http://localhost:3000
BASE_URL_FRONTEND=http://localhost:5173
JWT_SECRET=your_secret
NODE_ENV=development
OPENAI_API_KEY=your_secret_key
GITHUB_TOKEN=your_secret_key
AZURE_ENDPOINT=https://models.inference.ai.azure.com
MODEL_NAME=gpt-4o # gpt-3.5-turbo or gpt-4o
```

### Run seed to populate the database

```
npm run seed
```
