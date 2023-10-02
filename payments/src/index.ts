import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined ! ");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined ! ");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined ! ");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined ! ");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined ! ");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed ! ");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close()); // Watching for interrupt signals
    process.on("SIGTERM", () => natsWrapper.client.close()); // Watching for terminate signals

    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI); // We use the name of the clusterIP service: port that enables you to connect to the mongodb database. Mongodb create the db if if does not exist yet.
    console.log("Connected to MongoDB !!!");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!");
  });
};

start();
