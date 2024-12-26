import { Router, Request, Response, NextFunction } from "express";
import fetch from "node-fetch";
import { google } from "googleapis";
import dotenv from "dotenv";
import { GoogleCalendarEvent } from "../types/GoogleCalendarEvent";

dotenv.config();

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

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

router.get("/sub", (req: Request, res: Response) => {
  res.send("Sub Route Working");
});

router.post(
  "/verify-credential",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { credential } = req.body;
      if (!credential) {
        return res.status(400).json({ error: "Missing credential" });
      }
      console.log("Received credential:", credential.substring(0, 6));

      const ticket = await oauth2Client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      //NOTE: Uncomment the line below to see the payload in the console
      // console.log("Payload:", payload);

      res.json({ payload });
    } catch (error) {
      // console.error("Error verifying token:", error);
      res.status(500).json({ error: "Error verifying token" });
    }
  }
);

/* This specific route in the code is responsible for exchanging an authorization code for access and
refresh tokens using the OAuth2 client credentials. */
router.post(
  "/create-tokens",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Missing code" });
      }
      console.log("Received authorization code:", code.substring(0, 6));

      // Log the OAuth client configuration
      console.log("OAuth Client Config:", {
        hasClientId: !!oauth2Client._clientId,
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
          hasClientId: !!oauth2Client._clientId,
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

/* This specific route in the code is responsible for creating a new calendar event using the Google
Calendar API. */
router.post(
  "/create-calendar-event",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { event } = req.body;
      if (!event) {
        return res.status(400).json({ error: "Missing event" });
      }

      // Destructure the event object
      const { summary, description, location, start, end } = event;

      // Log the OAuth client credentials
      console.log("OAuth Client Config:", {
        hasAccessToken: !!oauth2Client.credentials.access_token,
        hasRefreshToken: !!oauth2Client.credentials.refresh_token,
      });

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const result = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary,
          description,
          location,
          start: {
            // just do start = event.start
            dateTime: start[0].dateTime,
            // Singapore timezone
            timeZone: "Asia/Singapore",
          },
          end: {
            dateTime: end[0].dateTime,
            timeZone: "Asia/Singapore",
          },
        },
      });

      res.json(result.data);
    } catch (error) {
      console.error("Error creating calendar event:", error);
      res.status(500).json({
        error: "Error creating calendar event",
      });
    }
  }
);

/* This specific route in the code is responsible for interacting with the OpenAI API, specifically
the ChatGPT model, to generate responses based on user prompts related to creating Google Calendar
events. */
router.post("/chatgpt", async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  console.log("Received prompt:", prompt);
  console.log("API Key exists:", !!apiKey);
  const url = "https://api.openai.com/v1/chat/completions";
  const APIBody = {
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: `
        You are a helpful assistant tasked with creating Google Calendar events based on user inputs.
        ### Details:
        - Current date: ${new Date().toDateString()}
        - Current time: ${new Date().toLocaleTimeString()}
        - Current timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
        - Required fields: summary, start, end.
        - Defaults:
          - If no times are provided, assume the event starts in 1 hour and lasts 30 minutes.
          - If only start is given, assume it lasts 30 minutes.
          - If only end is given, assume it starts 30 minutes prior.
          - Leave location and description empty if not provided.
        - Description: Be concise, descriptive, and neutral.
        - Location: Use accurate and specific details if provided.
      `,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: GoogleCalendarEvent,
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
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
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
