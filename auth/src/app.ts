import express from "express";
import { json } from "body-parser";
const cookieParser = require("cookie-parser");

import { currentUserRouter } from "./routes/current-user";
import { signUpRouter } from "./routes/signup";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { errorHandler } from "@mihndim-tickets/common";
import { NotFoundError } from "@mihndim-tickets/common";

const app = express();
app.set("trust poxy", true);
app.use(json());
app.use(cookieParser());

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.get("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
