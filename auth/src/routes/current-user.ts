import express from "express";
import { currentUser } from "@mihndim-tickets/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  //router.get("/api/users/currentuser", currentUser, requireAuth, (req, res) => {
  // if (!req.cookies.jwt) {
  //   return res.send({ currentUser: null });
  // }

  // try {
  //   const payload = jwt.verify(req.cookies.jwt, process.env.JWT_KEY!);
  //   res.send({ currentUser: payload });
  // } catch (error) {
  //   res.send({ currentUser: null });
  // }

  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
