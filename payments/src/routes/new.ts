import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotAuthorizedError,
  OrderStatus,
  BadRequestError,
  NotFoundError,
} from "@mihndim-tickets/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("The token must be provided"),
    body("orderId")
      .not()
      .isEmpty()
      .withMessage("The Order ID must  be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    // check if the user who is trying to pay has the same ID as the order.useId...
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Let ensure the order status in not cancelled...
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError(
        "Please you can not pay for a cancelled order !"
      );
    }

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save(); // Add a test to ensure the payment was created and saved. (payment).not.toBeNull();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
