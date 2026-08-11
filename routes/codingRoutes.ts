import { Router } from "express";
import { generateProblemHandler, evaluateCodeHandler } from "../controllers/codingController.js";

const router = Router();

// POST /api/coding/generate-problem
router.post("/generate-problem", generateProblemHandler);

// POST /api/coding/evaluate
router.post("/evaluate", evaluateCodeHandler);

export default router;
