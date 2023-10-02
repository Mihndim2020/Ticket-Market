import express from "express";
import { json } from "body-parser";
const cookieParser = require("cookie-parser");
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@mihndim-tickets/common";
import { deleteOderRouter } from "./routes/delete";
import { newOderRouter } from "./routes/new";
import { showOderRouter } from "./routes/show";
import { indexOderRouter } from "./routes";

const app = express();
app.set("trust poxy", true);
app.use(json());
app.use(cookieParser());
app.use(currentUser);
app.use(deleteOderRouter);
app.use(newOderRouter);
app.use(showOderRouter);
app.use(indexOderRouter);

app.get("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
