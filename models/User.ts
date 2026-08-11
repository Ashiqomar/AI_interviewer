export interface IUser {
  id?: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  targetRole: string;
  experienceLevel: "Entry" | "Mid" | "Senior" | "Lead" | "Principal";
  skills: string[];
  preferredCompanies: string[];
  bio?: string;
  totalXp?: number;
  streakDays?: number;
  createdAt: string;
  updatedAt: string;
}

// In-memory store + Schema interface for Phase 1 persistence
class UserStore {
  private users: Map<string, IUser> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const defaultUser: IUser = {
      id: "usr_101",
      firebaseUid: "fb_alex_rivera_101",
      email: "alex.rivera@example.com",
      displayName: "Alex Rivera",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      targetRole: "Senior Full-Stack Engineer",
      experienceLevel: "Senior",
      skills: ["React.js", "TypeScript", "Node.js", "System Design", "GraphQL", "Tailwind CSS", "MongoDB", "Redis"],
      preferredCompanies: ["Google", "Meta", "Stripe", "OpenAI"],
      bio: "Senior Full-Stack Engineer with 6+ years specializing in distributed React applications and serverless microservices.",
      totalXp: 4250,
      streakDays: 18,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.set(defaultUser.firebaseUid, defaultUser);
    this.users.set("default", defaultUser);
  }

  public getByUid(uid: string): IUser | undefined {
    return this.users.get(uid) || this.users.get("default");
  }

  public saveUser(user: Partial<IUser> & { firebaseUid: string }): IUser {
    const existing = this.users.get(user.firebaseUid) || {
      id: `usr_${Date.now()}`,
      firebaseUid: user.firebaseUid,
      email: user.email || "candidate@interviewiq.ai",
      displayName: user.displayName || "Candidate",
      targetRole: "Senior Software Engineer",
      experienceLevel: "Senior",
      skills: [],
      preferredCompanies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated: IUser = {
      ...existing,
      ...user,
      updatedAt: new Date().toISOString()
    };

    this.users.set(user.firebaseUid, updated);
    this.users.set("default", updated); // Keep default updated for single-user dev sessions
    return updated;
  }

  public getAll(): IUser[] {
    return Array.from(this.users.values()).filter((u, i, self) => self.findIndex(x => x.firebaseUid === u.firebaseUid) === i);
  }
}

export const UserModel = new UserStore();
