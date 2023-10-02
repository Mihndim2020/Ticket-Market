import express from "express";
import { json } from "body-parser";
const cookieParser = require("cookie-parser");
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@mihndim-tickets/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes/index";
import { updateTicketRouter } from "./routes/update";

const app = express();
app.set("trust poxy", true);
app.use(json());
app.use(cookieParser());
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.get("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
