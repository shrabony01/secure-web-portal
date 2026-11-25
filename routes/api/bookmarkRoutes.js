import { Router } from "express";
import Bookmark from "../../models/Bookmark.js";
import { authMiddleware } from "../../utils/auth.js";

const router = Router();

// Protect all /api/bookmarks routes with JWT authentication
router.use(authMiddleware);

// POST /api/bookmarks - Create a new bookmark owned by the logged-in user
router.post("/", async (req, res) => {
  try {
    const { title, url, description } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: "Title and URL are required." });
    }

    const bookmark = await Bookmark.create({
      title,
      url,
      description,
      user: req.user._id,
    });

    res.status(201).json(bookmark);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/bookmarks - Retrieve only bookmarks belonging to the logged-in user
router.get("/", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookmarks/:id - Retrieve a single bookmark if owned by the logged-in user
router.get("/:id", async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found." });
    }

    // Ownership authorization check
    if (bookmark.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "User is not authorized to view this bookmark." });
    }

    res.json(bookmark);
  } catch (err) {
    res.status(400).json({ message: "Invalid bookmark ID." });
  }
});

// PUT /api/bookmarks/:id - Update a bookmark if owned by the logged-in user
router.put("/:id", async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found." });
    }

    // Ownership authorization check
    if (bookmark.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "User is not authorized to update this bookmark." });
    }

    const { title, url, description } = req.body;
    if (title !== undefined) bookmark.title = title;
    if (url !== undefined) bookmark.url = url;
    if (description !== undefined) bookmark.description = description;

    const updatedBookmark = await bookmark.save();
    res.json(updatedBookmark);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/bookmarks/:id - Delete a bookmark if owned by the logged-in user
router.delete("/:id", async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found." });
    }

    // Ownership authorization check
    if (bookmark.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "User is not authorized to delete this bookmark." });
    }

    await bookmark.deleteOne();
    res.json({ message: "Bookmark deleted successfully!" });
  } catch (err) {
    res.status(400).json({ message: "Invalid bookmark ID." });
  }
});

export default router;
