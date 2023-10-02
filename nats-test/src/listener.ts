import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener is connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed ! ");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close()); // Watching for interrupt signals
process.on("SIGTERM", () => stan.close()); // Watching for terminate signals
