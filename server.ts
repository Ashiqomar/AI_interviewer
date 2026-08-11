import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import resumeRoutes from "./routes/resumeRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import codingRoutes from "./routes/codingRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import gamificationRoutes from "./routes/gamificationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { seedDatabase } from "./seedData.js";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Pre-seed Phase 1 mock data
  seedDatabase();

  // Middleware for body parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "InterviewIQ AI", timestamp: new Date().toISOString() });
  });

  app.use("/api/user", userRoutes);
  app.use("/api/resume", resumeRoutes);
  app.use("/api/interview", interviewRoutes);
  app.use("/api/coding", codingRoutes);
  app.use("/api/roadmap", roadmapRoutes);
  app.use("/api/gamification", gamificationRoutes);

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[InterviewIQ AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
