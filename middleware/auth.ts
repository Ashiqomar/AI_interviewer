import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split("Bearer ")[1];
    if (token && token !== "null" && token !== "undefined") {
      // Decode or mock token verification
      req.user = {
        uid: "fb_alex_rivera_101",
        email: "alex.rivera@example.com",
        displayName: "Alex Rivera",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      };
      return next();
    }
  }

  // Fallback default user for local testing and manual entry without requiring login
  req.user = {
    uid: "fb_alex_rivera_101",
    email: "alex.rivera@example.com",
    displayName: "Alex Rivera",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
  };

  next();
}
