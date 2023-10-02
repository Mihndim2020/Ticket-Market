import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@mihndim-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
