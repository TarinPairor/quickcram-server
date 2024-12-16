import { NextFunction, Request, Response } from "express";
const router = require("express").Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Api Route Working");
});

router.post(
  "/create-tokens",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.body;
      res.send(code);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
