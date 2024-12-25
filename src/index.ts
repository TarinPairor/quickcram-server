// filepath: /Users/tarinpairor/Library/Mobile Documents/com~apple~CloudDocs/Documents/GitHub/quickcram-ai/quickcram-server/src/index.ts
import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import createError from "http-errors";
import morgan from "morgan";
import apiRouter from "./routes/api";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

// Middleware to set COOP and COEP headers
app.use((req, res: Response, next: NextFunction) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://accounts.google.com https://apis.google.com"
  );
  next();
});

// Use CORS middleware
app.use(
  cors({
    origin: [
      process.env.VITE_FRONTEND_URL || "",
      process.env.PUBLIC_FRONTEND_URL || "",
    ],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Use morgan for logging
app.use(morgan("dev"));

// Parse JSON bodies
app.use(express.json());

// Use API routes
app.use("/api", apiRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Express + TypeScript Server" });
});

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.send("error");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
