import { Router, Request, Response, NextFunction } from "express";

const router = Router();

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

export default router;
