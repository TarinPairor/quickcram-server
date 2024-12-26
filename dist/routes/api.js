"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const node_fetch_1 = __importDefault(require("node-fetch"));
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
const GoogleCalendarEvent_1 = require("../types/GoogleCalendarEvent");
dotenv_1.default.config();
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
console.log("Checking OAuth configuration:");
console.log("Client ID exists:", !!clientId);
console.log("Client Secret exists:", !!clientSecret);
console.log("Redirect URI:", redirectUri);
const oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectUri);
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.send("Api Route Working");
});
router.get("/sub", (req, res) => {
    res.send("Sub Route Working");
});
router.post("/verify-credential", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ error: "Missing credential" });
        }
        console.log("Received credential:", credential.substring(0, 6));
        const ticket = yield oauth2Client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        //NOTE: Uncomment the line below to see the payload in the console
        // console.log("Payload:", payload);
        res.json({ payload });
    }
    catch (error) {
        // console.error("Error verifying token:", error);
        res.status(500).json({ error: "Error verifying token" });
    }
}));
/* This specific route in the code is responsible for exchanging an authorization code for access and
refresh tokens using the OAuth2 client credentials. */
router.post("/create-tokens", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
        const tokenResponse = yield oauth2Client.getToken({
            code: code,
            redirect_uri: redirectUri,
        });
        console.log("Token response received:", !!tokenResponse);
        if (!tokenResponse.tokens) {
            throw new Error("No tokens received in response");
        }
        oauth2Client.setCredentials(tokenResponse.tokens);
        res.json(tokenResponse.tokens);
    }
    catch (error) {
        console.error("Detailed error:", {
            message: error.message,
            response: (_a = error.response) === null || _a === void 0 ? void 0 : _a.data,
            config: {
                hasClientId: !!oauth2Client._clientId,
                // redirectUri: oauth2Client._redirectUri,
            },
        });
        res.status(500).json({
            error: "Error exchanging code for tokens",
            details: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message,
        });
    }
}));
/* This specific route in the code is responsible for creating a new calendar event using the Google
Calendar API. */
router.post("/create-calendar-event", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const calendar = googleapis_1.google.calendar({ version: "v3", auth: oauth2Client });
        const result = yield calendar.events.insert({
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
    }
    catch (error) {
        console.error("Error creating calendar event:", error);
        res.status(500).json({
            error: "Error creating calendar event",
        });
    }
}));
/* This specific route in the code is responsible for interacting with the OpenAI API, specifically
the ChatGPT model, to generate responses based on user prompts related to creating Google Calendar
events. */
router.post("/chatgpt", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        response_format: GoogleCalendarEvent_1.GoogleCalendarEvent,
    };
    try {
        const response = yield (0, node_fetch_1.default)(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + apiKey,
            },
            body: JSON.stringify(APIBody),
        });
        if (!response.ok) {
            const errorData = yield response.json();
            console.error("OpenAI API Error:", errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json();
        res.json(data);
    }
    catch (error) {
        console.error("Error calling ChatGPT API:", error);
        res.status(500).json({ error: "Error calling ChatGPT API" });
    }
}));
exports.default = router;
