import { Router } from "express";
import { generateRoadmapHandler, generateFlashcardsHandler } from "../controllers/roadmapController.js";

const router = Router();

// POST /api/roadmap/generate
router.post("/generate", generateRoadmapHandler);

// POST /api/roadmap/flashcards
router.post("/flashcards", generateFlashcardsHandler);

export default router;
