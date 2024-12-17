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

router.post("/chatgpt", async (req: Request, res: Response) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/chat/completions";
  const APIBody = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "How are you?" }],
    temperature: 0.7,
    max_tokens: 2000,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify(APIBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    res.status(500).json({ error: "Error calling ChatGPT API" });
  }
});

export default router;
