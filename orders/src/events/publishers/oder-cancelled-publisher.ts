import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from "@mihndim-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
