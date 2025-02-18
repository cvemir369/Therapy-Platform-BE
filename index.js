import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./db/index.js";
import { PORT, BASE_URL_FRONTEND } from "./config/config.js";
import errorHandler from "./middlewares/errorHandler.js";
import userRouter from "./routes/userRouter.js";
import therapistRouter from "./routes/therapistRouter.js";
import userQuestionRouter from "./routes/userQuestionRouter.js";

const app = express();

app.use(
  json(),
  cors({ origin: BASE_URL_FRONTEND, credentials: true }),
  cookieParser()
);

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.use("/users", userRouter);
app.use("/therapists", therapistRouter);
app.use("/user-questions", userQuestionRouter);

app.use("*", (req, res) => res.status(404).json({ message: "Page not found" }));
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on port : ${PORT}`));
