import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest } from "@mihndim-tickets/common";
import { BadRequestError } from "@mihndim-tickets/common";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().isLength({ min: 4, max: 20 }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("This email is already taken !");
      throw new BadRequestError("This email is already taken");
    }

    const { build } = User; // Here User.build did not work, so I had to destructure build out of User, and it worked. Instead of User.build({}).

    const user = build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! // We checked and made sure the evironment variable was defined.
    );

    res.cookie("jwt", userJwt); // You have to set the cookie before is been sent to the client...

    //res.send(req.session);
    res.status(201).send(user);
  }
);

export { router as signUpRouter };
