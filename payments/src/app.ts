import express from "express";
import { json } from "body-parser";
const cookieParser = require("cookie-parser");
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@mihndim-tickets/common";
import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust poxy", true);
app.use(json());
app.use(cookieParser());
app.use(currentUser);
app.use(createChargeRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
