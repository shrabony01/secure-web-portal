import { Router } from "express";
import userRoutes from "./userRoutes.js";
import bookmarkRoutes from "./bookmarkRoutes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/bookmarks", bookmarkRoutes);

export default router;
