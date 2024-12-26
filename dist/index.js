"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// filepath: /Users/tarinpairor/Library/Mobile Documents/com~apple~CloudDocs/Documents/GitHub/quickcram-ai/quickcram-server/src/index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_errors_1 = __importDefault(require("http-errors"));
const morgan_1 = __importDefault(require("morgan"));
const api_1 = __importDefault(require("./routes/api"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
// Middleware to set COOP and COEP headers
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.setHeader("Content-Security-Policy", "script-src 'self' https://accounts.google.com https://apis.google.com");
    next();
});
// Use CORS middleware
app.use((0, cors_1.default)({
    origin: [
        process.env.VITE_FRONTEND_URL || "",
        process.env.PUBLIC_FRONTEND_URL || "",
    ],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
}));
// Use morgan for logging
app.use((0, morgan_1.default)("dev"));
// Parse JSON bodies
app.use(express_1.default.json());
// Use API routes
app.use("/api", api_1.default);
app.get("/", (req, res) => {
    res.json({ message: "Express + TypeScript Server" });
});
// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// Error handler
app.use((err, req, res, next) => {
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
exports.default = app;
