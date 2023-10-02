import {
  Publisher,
  Subjects,
  PaymentCreatedEvent,
} from "@mihndim-tickets/common";
import { Message } from "node-nats-streaming";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {}
}
