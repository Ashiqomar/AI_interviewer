import { Router } from "express";
import { getDailyChallengeHandler, getLeaderboardHandler, claimXpHandler } from "../controllers/gamificationController.js";

const router = Router();

// GET /api/gamification/daily-challenge
router.get("/daily-challenge", getDailyChallengeHandler);

// GET /api/gamification/leaderboard
router.get("/leaderboard", getLeaderboardHandler);

// POST /api/gamification/claim-xp
router.post("/claim-xp", claimXpHandler);

export default router;
