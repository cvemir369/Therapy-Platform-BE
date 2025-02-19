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
```

### Get All Answers for a User:

```
db.answers.find({ user_id: ObjectId("...") });
```

### Get All Answers for a Question:

```
db.answers.find({ question_id: ObjectId("...") });
```

### Get All Questions and Their Answers for a User (using $lookup for a join):

```
db.users.aggregate([
  {
    $match: { _id: ObjectId("...") },
  },
  {
    $lookup: {
      from: "answers",
      localField: "_id",
      foreignField: "user_id",
      as: "user_answers",
    },
  },
  {
    $lookup: {
      from: "questions",
      localField: "user_answers.question_id",
      foreignField: "_id",
      as: "questions",
    },
  },
]);
```
