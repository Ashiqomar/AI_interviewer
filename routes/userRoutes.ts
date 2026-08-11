import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  getUserProfileHandler,
  saveUserProfileHandler,
  saveManualResumeHandler,
  saveManualInterviewHandler,
  seedDatabaseHandler
} from "../controllers/userController.js";

const router = Router();

// Apply auth middleware to user routes
router.use(authMiddleware as any);

// GET /api/user/profile
router.get("/profile", getUserProfileHandler as any);

// POST /api/user/profile
router.post("/profile", saveUserProfileHandler as any);

// POST /api/resume/manual
router.post("/resume/manual", saveManualResumeHandler as any);

// POST /api/interview/manual
router.post("/interview/manual", saveManualInterviewHandler as any);

// POST /api/seed
router.post("/seed", seedDatabaseHandler as any);
router.get("/seed", seedDatabaseHandler as any);

export default router;
