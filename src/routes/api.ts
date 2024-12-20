import { Router, Request, Response, NextFunction } from "express";
import fetch from "node-fetch";
import { google } from "googleapis";
import dotenv from "dotenv";
import { existsSync } from "fs";

dotenv.config();

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = "http://localhost:5173/auth/callback";

console.log("Checking OAuth configuration:");
console.log("Client ID exists:", !!clientId);
console.log("Client Secret exists:", !!clientSecret);
console.log("Redirect URI:", redirectUri);

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Api Route Working");
});

router.post(
  "/verify-token",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { credential } = req.body;
      if (!credential) {
        return res.status(400).json({ error: "Missing credential" });
      }
      console.log("Received credential:", credential);

      const ticket = await oauth2Client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      console.log("Payload:", payload);

      res.json({ payload });
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(500).json({ error: "Error verifying token" });
    }
  }
);

router.post(
  "/create-tokens",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Missing code" });
      }
      console.log("Received authorization code:", code);

      // Log the OAuth client configuration
      console.log("OAuth Client Config:", {
        clientId: oauth2Client._clientId,
        // redirectUri: oauth2Client.redirectUri,
        hasSecret: !!oauth2Client._clientSecret,
      });

      const tokenResponse = await oauth2Client.getToken({
        code: code,
        redirect_uri: redirectUri,
      });

      console.log("Token response received:", !!tokenResponse);

      if (!tokenResponse.tokens) {
        throw new Error("No tokens received in response");
      }

      oauth2Client.setCredentials(tokenResponse.tokens);

      res.json(tokenResponse.tokens);
    } catch (error: any) {
      console.error("Detailed error:", {
        message: error.message,
        response: error.response?.data,
        config: {
          clientId: !!oauth2Client._clientId,
          // redirectUri: oauth2Client._redirectUri,
        },
      });
      res.status(500).json({
        error: "Error exchanging code for tokens",
        details: error.response?.data || error.message,
      });
    }
  }
);

router.post(
  "/create-calendar-event",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const { event } = req.body;
      // if (!event) {
      //   return res.status(400).json({ error: "Missing event" });
      // }

      // Log the OAuth client crendentials ie if it has accesstoken and refresh token
      console.log("OAuth Client Config:", {
        hasAccessToken: !!oauth2Client.credentials.access_token,
        hasRefreshToken: !!oauth2Client.credentials.refresh_token,
      });

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const result = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: "Test Event",
          description: "This is a test event",
          start: {
            //now in Singapore
            dateTime: new Date().toISOString(),
            timeZone: "Asia/Singapore",
          },
          end: {
            dateTime: new Date().toISOString(),
            timeZone: "Asia/Singapore",
          },
        },
      });

      res.json(result.data);
    } catch (error) {
      next(error);
      console.error("Error creating calendar event:", error);
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
