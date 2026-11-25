import { Router } from "express";
import passport from "passport";
import User from "../../models/User.js";
import { signToken } from "../../utils/auth.js";

const router = Router();

// POST /api/users/register - Register a new local user and return a signed JWT
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists." });
    }

    const user = await User.create({ username, email, password });
    const token = signToken(user);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ token, user: userResponse });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/users/login - Authenticate a local user and return a signed JWT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.isCorrectPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user);
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ token, user: userResponse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/auth/github - Initiate GitHub OAuth 2.0 flow
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
);

// GET /api/users/auth/github/callback - GitHub OAuth callback; issues app JWT
router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api/users/auth/github/failure",
    session: false,
  }),
  (req, res) => {
    const token = signToken(req.user);

    if (process.env.CLIENT_URL) {
      return res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
    }

    res.json({
      message: "GitHub authentication successful!",
      token,
      user: req.user,
    });
  },
);

// GET /api/users/auth/github/failure - Handle denied or failed GitHub login
router.get("/auth/github/failure", (req, res) => {
  res.status(401).json({ message: "GitHub authentication failed." });
});

export default router;
