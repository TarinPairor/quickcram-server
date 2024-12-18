import { Router, Request, Response, NextFunction } from "express";
import fetch from "node-fetch";

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
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful math tutor. Guide the user through the solution step by step.",
      },
      {
        role: "user",
        content: "how can I solve 8x + 7 = -23",
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "math_reasoning",
        schema: {
          type: "object",
          properties: {
            steps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  explanation: { type: "string" },
                  output: { type: "string" },
                },
                required: ["explanation", "output"],
                additionalProperties: false,
              },
            },
            final_answer: { type: "string" },
          },
          required: ["steps", "final_answer"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
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
