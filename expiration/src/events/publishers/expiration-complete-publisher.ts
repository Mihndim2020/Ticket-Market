import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@mihndim-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
