import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connection.js";
import passport from "./config/passport.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Parse incoming JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport middleware for GitHub OAuth
app.use(passport.initialize());

// Health-check root route
app.get("/", (req, res) => {
  res.json({ message: "Secure Web Portal API is running." });
});

// Mount API routes
app.use(routes);

// Connect to MongoDB before starting the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});
