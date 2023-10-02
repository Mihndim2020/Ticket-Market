import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@mihndim-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
