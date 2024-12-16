import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import createError from "http-errors";
import morgan from "morgan";
import apiRouter from "./routes/api";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Use morgan for logging
app.use(morgan("dev"));

// Parse JSON bodies
app.use(express.json());

// Use API routes
app.use("/api", apiRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
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
