import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@mihndim-tickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      // .custom((input: string) => {
      //   mongoose.Types.ObjectId.isValid(input);
      // })
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find a ticket that the user is trying to order from the database...
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    // We have to make sure the ticket is not already reserved, reserved means ticket is associated with order and status is different from cancelled. Find and oder that is associated with that ticket...

    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("This ticket was already reserved");
    }
    // Calculate the expiration time of the ticket...

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    //  Build our order and save to the DB...
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    // Create an event saying that an order was created...
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: parseInt(ticket.price), // Still to understand why ticket.price is a string here....
      },
    });

    res.status(200).send(order);
  }
);

export { router as newOderRouter };
