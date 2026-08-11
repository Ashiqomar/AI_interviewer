import { Router } from "express";
import multer from "multer";
import { analyzeResumeHandler, matchJdHandler } from "../controllers/resumeController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const router = Router();

// POST /api/resume/analyze
router.post("/analyze", upload.single("file"), analyzeResumeHandler);

// POST /api/resume/match-jd
router.post("/match-jd", matchJdHandler);

export default router;
