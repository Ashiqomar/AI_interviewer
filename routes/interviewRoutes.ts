import { Router } from "express";
import { startInterviewHandler, nextQuestionHandler, evaluateStarHandler } from "../controllers/interviewController.js";

const router = Router();

// POST /api/interview/start
router.post("/start", startInterviewHandler);

// POST /api/interview/next-question
router.post("/next-question", nextQuestionHandler);

// POST /api/interview/evaluate-star
router.post("/evaluate-star", evaluateStarHandler);

export default router;
