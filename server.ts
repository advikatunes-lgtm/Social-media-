import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Platform, PostStatus, Role, PlanType } from "./src/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables. Gemini features might fail.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// JSON File Database path
const DB_PATH = path.join(process.cwd(), "db.json");

// Helper function to load DB
function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf-8");
      const db = JSON.parse(content);
      // Ensure all loaded users have a password field (default or preserved)
      if (db && Array.isArray(db.users)) {
        let changed = false;
        db.users = db.users.map((user: any) => {
          if (!user.password) {
            user.password = "hunter123";
            changed = true;
          }
          return user;
        });
        if (changed) {
          fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
        }
      }
      return db;
    }
  } catch (error) {
    console.error("Failed to load local DB, resetting:", error);
  }

  // Seed default data if not present
  const defaultDB = {
    users: [
      {
        id: "usr_1",
        email: "advikatunes@gmail.com",
        password: "hunter123",
        firstName: "Thrag",
        lastName: "The Hunter",
        role: "SUPER_ADMIN",
        isVerified: true,
        twoFactorEnabled: true,
        avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=thrag",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_2",
        email: "grunt@cavemansocial.com",
        password: "hunter123",
        firstName: "Ogg",
        lastName: "Stone-Carver",
        role: "EDITOR",
        isVerified: true,
        twoFactorEnabled: false,
        avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=ogg",
        createdAt: new Date().toISOString(),
      }
    ],
    workspaces: [
      {
        id: "ws_1",
        name: "Cave Clan Prime",
        slug: "cave-clan-prime",
        brandColor: "#FF6B2B",
        createdAt: new Date().toISOString(),
      }
    ],
    socialAccounts: [
      {
        id: "acc_insta",
        workspaceId: "ws_1",
        platform: "INSTAGRAM",
        accountName: "Grog's Spear Shop",
        accountHandle: "grogs_spears",
        accountAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        sessionValid: true,
        lastVerified: new Date(Date.now() - 3600000 * 4).toISOString(),
        proxyUrl: "socks5://185.122.40.11:1080",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        id: "acc_twitter",
        workspaceId: "ws_1",
        platform: "TWITTER",
        accountName: "Brontosaurus Ribs Co.",
        accountHandle: "bronto_ribs",
        accountAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        sessionValid: true,
        lastVerified: new Date(Date.now() - 3600000 * 12).toISOString(),
        proxyUrl: "socks5://104.28.16.20:8080",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        id: "acc_linkedin",
        workspaceId: "ws_1",
        platform: "LINKEDIN",
        accountName: "Thrag Hunter Agency",
        accountHandle: "thrag-hunting",
        accountAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        sessionValid: false,
        lastVerified: new Date(Date.now() - 86400000 * 2).toISOString(),
        proxyUrl: "socks5://192.168.2.1:8888",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      },
      {
        id: "acc_youtube",
        workspaceId: "ws_1",
        platform: "YOUTUBE",
        accountName: "Cave Painting Academy",
        accountHandle: "cave_painters",
        accountAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
        sessionValid: true,
        lastVerified: new Date().toISOString(),
        proxyUrl: "socks5://45.138.2.9:3128",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      }
    ],
    posts: [
      {
        id: "post_1",
        workspaceId: "ws_1",
        createdById: "usr_1",
        title: "Mammoth BBQ marketing run",
        caption: "ME SMASH HUNGER! 🔥 Mammoth ribs roasted over real hickory wood. Buy one, get bone spear FREE. Today only at fire pit. Ugh!",
        mediaUrls: ["https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"],
        platforms: ["INSTAGRAM", "TWITTER"],
        status: "PUBLISHED",
        isRecurring: false,
        tags: ["promo", "mammoth", "hunger"],
        publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "post_2",
        workspaceId: "ws_1",
        createdById: "usr_1",
        title: "Stone wheels launch announcment",
        caption: "Neanderthals, look! Round stone roll fast. No drag. Much speed. Upgrade your cart now. 🛞 High performance slate-engineered. PM for trading price. #Innovation #Prehistoric",
        mediaUrls: ["https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"],
        platforms: ["LINKEDIN", "TWITTER"],
        status: "SCHEDULED",
        isRecurring: false,
        scheduledAt: new Date(Date.now() + 3600000 * 4).toISOString(),
        tags: ["launch", "tech", "wheels"],
        createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
      },
      {
        id: "post_3",
        workspaceId: "ws_1",
        createdById: "usr_2",
        title: "Daily Shaman Wisdom Quote",
        caption: "Wise shaman say: 'Before strike flint to dry leaves, check wind direction.' Good fire warm cave. Bad fire burn beard. Sleep on that. 🧘‍♂️💤 #CaveIntelligence",
        mediaUrls: [],
        platforms: ["TWITTER"],
        status: "SCHEDULED",
        isRecurring: true,
        recurringRule: {
          frequency: "daily",
          interval: 1
        },
        scheduledAt: new Date(Date.now() + 3600000 * 25).toISOString(),
        tags: ["wisdom", "quote"],
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: "post_4",
        workspaceId: "ws_1",
        createdById: "usr_1",
        title: "Cave painting masterclass v1",
        caption: "Ever wanted to draw strong bison on wall? 🦬 Shaman Gork show you how to mix berries and tallow for 3,000 year durability. Watch now!",
        mediaUrls: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80"],
        platforms: ["YOUTUBE"],
        status: "DRAFT",
        isRecurring: false,
        tags: ["tutorial", "art"],
        createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      }
    ],
    publishResults: [
      {
        id: "res_1",
        postId: "post_1",
        socialAccountId: "acc_insta",
        platform: "INSTAGRAM",
        status: "PUBLISHED",
        publishedUrl: "https://www.instagram.com/p/C_caveman_mammoth123",
        screenshotUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        attemptCount: 1,
        publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: "res_2",
        postId: "post_1",
        socialAccountId: "acc_twitter",
        platform: "TWITTER",
        status: "PUBLISHED",
        publishedUrl: "https://twitter.com/bronto_ribs/status/4938210984",
        screenshotUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        attemptCount: 1,
        publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    ],
    scheduledJobs: [
      {
        id: "job_stone_wheels",
        postId: "post_2",
        bullJobId: "bull_job_102",
        scheduledAt: new Date(Date.now() + 3600000 * 4).toISOString(),
        status: "delayed",
        attempts: 0,
        logs: ["Job created in BullMQ", "Scheduled delay of 14,400,000ms set", "Target platforms parsed: LINKEDIN, TWITTER"],
        createdAt: new Date().toISOString()
      },
      {
        id: "job_shaman_wisdom",
        postId: "post_3",
        bullJobId: "bull_job_103",
        scheduledAt: new Date(Date.now() + 3600000 * 25).toISOString(),
        status: "delayed",
        attempts: 0,
        logs: ["Recurring rule matched", "Adding post daily interval, Job scheduled"],
        createdAt: new Date().toISOString()
      }
    ],
    mediaFiles: [
      {
        id: "med_1",
        workspaceId: "ws_1",
        uploadedById: "usr_1",
        filename: "roasted_meat.jpg",
        originalName: "roasted_meat_mammoth_ribs.jpg",
        mimeType: "image/jpeg",
        size: 245100,
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        tags: ["bbq", "meat", "mammoth"],
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: "med_2",
        workspaceId: "ws_1",
        uploadedById: "usr_1",
        filename: "stone_wheel.jpg",
        originalName: "stone_wheel_isometric.jpg",
        mimeType: "image/jpeg",
        size: 189400,
        url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
        tags: ["wheels", "stone", "product"],
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: "med_3",
        workspaceId: "ws_1",
        uploadedById: "usr_2",
        filename: "cave_art_tutorial.jpg",
        originalName: "shaman_painting_wall.jpg",
        mimeType: "image/jpeg",
        size: 512000,
        url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80",
        tags: ["paint", "art", "shaman"],
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    subscriptions: [
      {
        id: "sub_1",
        workspaceId: "ws_1",
        plan: "PRO",
        status: "active",
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 86400000 * 30).toISOString(),
        cancelAtPeriodEnd: false
      }
    ],
    notifications: [
      {
        id: "not_1",
        userId: "usr_1",
        type: "PUBLISH_SUCCESS",
        title: "Mammoth post successfully published!",
        message: "Post 'Mammoth BBQ marketing run' was published to Instagram and Twitter in 8.4 seconds with 0 warnings.",
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "not_2",
        userId: "usr_1",
        type: "SESSION_EXPIRED",
        title: "LinkedIn Session Lost",
        message: "LinkedIn account 'Thrag Hunter Agency' cookies expired. Click to re-verify using our stealth proxy gateway.",
        isRead: false,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    auditLogs: [
      {
        id: "aud_1",
        userId: "usr_1",
        workspaceId: "ws_1",
        action: "POST_CREATE",
        resource: "POST",
        resourceId: "post_2",
        metadata: { title: "Stone wheels launch announcment" },
        ipAddress: "103.284.11.23",
        userAgent: "Chrome 121 / Win10",
        createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
      }
    ]
  };

  fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2), "utf-8");
  return defaultDB;
}

function saveDB(db: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB on starting
  const database = loadDB();

  // Middleware for parsing JSON requests
  app.use(express.json());

  // Helper to parse session user from custom cookie parsing
  function getSessionUserId(req: any): string | null {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return null;
    const match = cookieHeader.match(/(?:^|;)\s*session_user_id=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  // --- AUTHENTICATION API ROUTES ---
  app.get("/api/auth/me", (req, res) => {
    try {
      const db = loadDB();
      const userId = getSessionUserId(req);
      if (!userId) {
        return res.json({ authenticated: false, user: null });
      }
      const user = db.users.find((u: any) => u.id === userId);
      if (!user) {
        // Clear expired/missing user cookie
        res.setHeader("Set-Cookie", "session_user_id=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax");
        return res.json({ authenticated: false, user: null });
      }
      return res.json({ authenticated: true, user });
    } catch (err: any) {
      console.error("Auth check failed:", err);
      return res.status(500).json({ error: "Auth check server malfunction", details: err.message });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    try {
      const db = loadDB();
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required!" });
      }

      const user = db.users.find(
        (u: any) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!user) {
        return res.status(401).json({ error: "No such Neanderthal user registered." });
      }

      // Simple password check
      if (user.password !== password) {
        return res.status(401).json({ error: "Incorrect password code. Try again!" });
      }

      // Successful login
      res.setHeader(
        "Set-Cookie",
        `session_user_id=${user.id}; Path=/; HttpOnly; Max-Age=2592000; SameSite=Lax`
      );

      // Create an audit log
      const auditLog = {
        id: "aud_" + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        workspaceId: "ws_1",
        action: "USER_LOGIN",
        resource: "AUTH",
        resourceId: user.id,
        metadata: { email: user.email },
        ipAddress: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "unknown",
        createdAt: new Date().toISOString()
      };
      db.auditLogs = db.auditLogs || [];
      db.auditLogs.unshift(auditLog);
      saveDB(db);

      return res.json({ authenticated: true, user });
    } catch (err: any) {
      console.error("Login endpoint failed:", err);
      return res.status(500).json({ error: "Failed to process login requests", details: err.message });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    try {
      const db = loadDB();
      const { email, password, firstName, lastName, avatar } = req.body;
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: "All profile fields are required for enlistment." });
      }

      const exists = db.users.some(
        (u: any) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (exists) {
        return res.status(400).json({ error: "Email is already claimed by another tribe member." });
      }

      const newUser: any = {
        id: "usr_" + Math.random().toString(36).substr(2, 9),
        email: email.trim(),
        password: password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: "EDITOR", // Default role
        isVerified: true,
        twoFactorEnabled: false,
        avatar: avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(firstName)}`,
        createdAt: new Date().toISOString()
      };

      db.users.push(newUser);

      // Create an audit log
      const auditLog = {
        id: "aud_" + Math.random().toString(36).substr(2, 9),
        userId: newUser.id,
        workspaceId: "ws_1",
        action: "USER_REGISTER",
        resource: "AUTH",
        resourceId: newUser.id,
        metadata: { email: newUser.email },
        ipAddress: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "unknown",
        createdAt: new Date().toISOString()
      };
      db.auditLogs = db.auditLogs || [];
      db.auditLogs.unshift(auditLog);
      
      saveDB(db);

      // Automatically sign in
      res.setHeader(
        "Set-Cookie",
        `session_user_id=${newUser.id}; Path=/; HttpOnly; Max-Age=2592000; SameSite=Lax`
      );

      return res.json({ authenticated: true, user: newUser });
    } catch (err: any) {
      console.error("Signup endpoint failed:", err);
      return res.status(500).json({ error: "Failed to create account profile", details: err.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.setHeader(
      "Set-Cookie",
      "session_user_id=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );
    return res.json({ ok: true });
  });

  // SSE Connections map for live terminal logging
  const activeSseConnections: Map<string, express.Response[]> = new Map();

  // SSE stream endpoint
  app.get("/api/terminal/stream/:id", (req, res) => {
    const streamId = req.params.id;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const clientList = activeSseConnections.get(streamId) || [];
    clientList.push(res);
    activeSseConnections.set(streamId, clientList);

    req.on("close", () => {
      const active = activeSseConnections.get(streamId) || [];
      const index = active.indexOf(res);
      if (index !== -1) {
        active.splice(index, 1);
      }
      if (active.length === 0) {
        activeSseConnections.delete(streamId);
      } else {
        activeSseConnections.set(streamId, active);
      }
    });
  });

  // Helper to send log lines over SSE
  function broadcastTerminalLog(streamId: string, logLine: string) {
    const clients = activeSseConnections.get(streamId);
    if (clients) {
      clients.forEach((client) => {
        client.write(`data: ${JSON.stringify({ log: logLine })}\n\n`);
      });
    }
  }

  // API Endpoint: AI Content Assistant (Caption Refinement via Gemini 3.5-flash)
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { prompt, vibe, platform } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Input prompt is required." });
      }

      console.log(`AI Social Generator triggered with vibe: "${vibe}", target: "${platform || "general"}"`);

      let systemPrompt = `You are the ultimate 'Prehistoric Agent' — Chief Shaman Content Strategist for Caveman Social. Your specialty is taking boring, sanitised modern text or simple ideas, and infusing them with visceral, raw, energetic, bone-crushing power.
You MUST write modern marketing copy, but deliver it with either standard caveman vocabulary, proud neanderthal confidence, or wise elder shaman prose, depending on the requested 'vibe' parameter.`;

      if (vibe === "oongaboonga") {
        systemPrompt += `
Vibe requested: 'Oonga Boonga / Raw Caveman'.
Rules for translation:
- Use primitive, powerful words. Focus on verbs like SMASH, CRUSH, ROAST, HUNT, FLY, SHINE.
- Speak in first or third person with cave jargon. E.g., "ME HUNGRY", "YOU COLD", "WE CHASE BISON".
- Short, punchy, maximum impact sentences.
- Heavy use of visceral emojis (🔥, 🦴, 🦬, 🪵, 🍖, 🪓, 🛞).
- Absolute direct messaging. No soft fluffy words.`;
      } else if (vibe === "wisdom") {
        systemPrompt += `
Vibe requested: 'Shamanic Cave Wisdom'.
Rules for translation:
- Speak as a profound tribal elder who reads stars and smoke clouds.
- Calm, prophetic, analogical, heavy with environmental wisdom.
- Speak of the great spirit, dry twigs, flint stones, and ancient shadows.
- Elegant, poetic, yet simple.
- Emojis: 🧘‍♂️, 🌟, 💨, 💨, 🌑, 🌲.`;
      } else if (vibe === "brutal") {
        systemPrompt += `
Vibe requested: 'Brutalist Neanderthal'.
Rules for translation:
- Absolute minimalist efficiency. No waste of characters.
- Grunt style, direct, unapologetic.
- Contrast modern high-tech with heavy rock metaphors.
- Hard-hitting business benefits delivered like a club hit to the skull.
- Emojis: 🧱, 🔨, 🪨, 🪙, 🦾.`;
      } else {
        // High-energy premium agency tone
        systemPrompt += `
Vibe requested: 'Caveman Fire Starter (High Energy Agency Grade)'.
Rules for translation:
- Perfect blend of modern agency copy with prehistoric punch.
- High energy, engaging hooks, extremely readable formatted lists.
- Optimize layout spacing, use bold headings.
- Strong calls to action (e.g. "Trade wood skin now").
- Emojis: ⚡, 💥, ✨, 📈, 🚀.`;
      }

      if (platform) {
        systemPrompt += `
Tailor specifically for platform constraint limits:
- INSTAGRAM: Maximize aesthetic hooks, spacing, suggestions of swipe-card contents, and list 5 extremely targeted hashtag blocks. Max 200 words.
- TWITTER: Hard limit of 280 characters! Keep it extremely short, highly engaging, single line spacing, with at most 1-2 powerful hashtags.
- LINKEDIN: Professional corporate speech layered with primitive business analogies. Speak of B2B (Bison to Bison) trading, ROI (Return on Ivory), or tribal alignment. Use beautiful paragraph spacing.
- YOUTUBE: Script hook style with a highly clickable title idea, timestamp tags, and detailed short notes.`;
      }

      const promptString = `Transform, extend, or generate matching content for this input: "${prompt}". Let your primal magic flow! Defend clean visual spacing.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptString,
        config: {
          systemInstruction: systemPrompt,
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response from Shaman AI assistant.");
      }

      return res.json({ result: text });
    } catch (error: any) {
      console.error("Gemini assistant failed:", error);
      return res.status(500).json({
        error: "Cave Shaman fell in fire. Please try again! (API failure)",
        details: error.message || error,
      });
    }
  });

  // POST CRUD: Get All Posts
  app.get("/api/workspaces/:id/posts", (req, res) => {
    const db = loadDB();
    const workspaceId = req.params.id;
    const filtered = db.posts.filter((p: any) => p.workspaceId === workspaceId);
    res.json(filtered);
  });

  // POST CRUD: Create a Post and optionally trigger immediate publication simulation!
  app.post("/api/workspaces/:id/posts", (req, res) => {
    const db = loadDB();
    const workspaceId = req.params.id;
    const { title, caption, mediaUrls, platforms, scheduledAt, isRecurring, recurringRule, tags } = req.body;

    const newPost = {
      id: "post_" + Math.random().toString(36).substr(2, 9),
      workspaceId,
      createdById: "usr_1",
      title: title || "Cave post",
      caption,
      mediaUrls: mediaUrls || [],
      platforms: platforms || ["TWITTER"],
      status: scheduledAt ? "SCHEDULED" : "DRAFT",
      isRecurring: !!isRecurring,
      recurringRule: isRecurring ? recurringRule : undefined,
      scheduledAt: scheduledAt || undefined,
      tags: tags || [],
      createdAt: new Date().toISOString()
    };

    db.posts.push(newPost);

    // If scheduled, add an active queue job!
    if (scheduledAt) {
      const jobId = "job_" + Math.random().toString(36).substr(2, 9);
      db.scheduledJobs.push({
        id: jobId,
        postId: newPost.id,
        bullJobId: "bull_job_" + Math.floor(Math.random() * 900 + 100),
        scheduledAt,
        status: "delayed",
        attempts: 0,
        logs: ["Pr primal scheduler added job", `Delay set until ${scheduledAt}`, `Target: ${newPost.platforms.join(", ")}`],
        createdAt: new Date().toISOString()
      });
    }

    saveDB(db);
    res.status(201).json(newPost);
  });

  // POST ACTIONS: Publish Post Now (Simulates immediate Playwright browser sequence!)
  app.post("/api/posts/:postId/publish-now", async (req, res) => {
    const db = loadDB();
    const { postId } = req.params;
    const { streamId } = req.body; // To stream real-time execution logs if client binds it!

    const postIndex = db.posts.findIndex((p: any) => p.id === postId);
    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = db.posts[postIndex];

    // Mark post as PUBLISHING
    db.posts[postIndex].status = "PUBLISHING";
    saveDB(db);

    // Immediate confirmation so backend doesn't block the client
    res.json({ message: "Publishing sequence triggered.", post: db.posts[postIndex] });

    // Run execution in back-thread with logs
    const runPublishSimulation = async () => {
      const log = (msg: string) => {
        console.log(`[PLAYWRIGHT SIM] ${msg}`);
        if (streamId) {
          broadcastTerminalLog(streamId, `[PLAYWRIGHT] ${msg}`);
        }
      };

      try {
        log(`Triggering automation sequence for: "${post.title || "Untitled"}"`);
        await new Promise((r) => setTimeout(r, 600));

        // Iterate through all target platforms of this post
        for (const platform of post.platforms) {
          log(`──────────────────────────────────────────`);
          log(`BOOTING PLAYWRIGHT STEALTH CONTAINER FOR: ${platform}`);
          log(`──────────────────────────────────────────`);
          await new Promise((r) => setTimeout(r, 800));

          // Fetch connection session for this platform
          const account = db.socialAccounts.find((a: any) => a.platform === platform && a.workspaceId === post.workspaceId);
          if (!account) {
            log(`[WARNING] No connected social account found for ${platform}. Booting emergency session...`);
            await new Promise((r) => setTimeout(r, 600));
          } else {
            log(`Loading encrypted context metadata cookies for: @${account.accountHandle || "user"}`);
            log(`Enforcing custom agent: "${account.userAgent || "Mozilla/5.0 Chrome/121"}"`);
            if (account.proxyUrl) {
              log(`Routing through isolated egress proxy node: ${account.proxyUrl}`);
            }
          }
          await new Promise((r) => setTimeout(r, 900));

          log(`Initializing Chromium headless profile via playwright-extra...`);
          log(`Applying webfingerprint, stealth rules, Canvas evasion signatures.`);
          await new Promise((r) => setTimeout(r, 800));

          log(`Navigating to official ${platform.toLowerCase()}.com endpoint...`);
          await new Promise((r) => setTimeout(r, 1000));

          log(`Injecting cookies and verifying active authorization keys...`);
          
          // Let's check session status of that account!
          if (account && !account.sessionValid) {
            log(`[CRITICAL ERROR] COOKIES OR SESSION INVALID FOR ${platform}`);
            log(`[RECOVERY] Anti-bot challenge trigger: Session verification failed (Cookie expired).`);
            log(`[ABANDON] Terminating playwright instance.`);
            throw new Error(`Session validation failed for platform ${platform}. Re-verification required.`);
          }
          await new Promise((r) => setTimeout(r, 600));

          log(`Successfully validated session gate! Active viewport bounds set to 1280x720.`);
          log(`Locating post composers textbox elements on screen...`);
          await new Promise((r) => setTimeout(r, 700));

          log(`Simulating organic typing text with 45ms natural millisecond keypress delays...`);
          log(`Entering payload: "${post.caption.substring(0, 30)}..."`);
          await new Promise((r) => setTimeout(r, 1000));

          if (post.mediaUrls && post.mediaUrls.length > 0) {
            log(`Detected media URLs list. Streaming assets in background...`);
            log(`Initiating browser file transfer wrapper: "${post.mediaUrls[0].split("/").pop()}"`);
            await new Promise((r) => setTimeout(r, 900));
            log(`File attached successfully. Validating render layout in draft...`);
          }

          log(`Executing click trigger on main submit button elements...`);
          await new Promise((r) => setTimeout(r, 1200));

          log(`Waiting for feed upload confirmation tokens and layout redirects...`);
          await new Promise((r) => setTimeout(r, 800));

          const mockPublishedUrl = platform === "INSTAGRAM" ? `https://instagram.com/p/C_cave_${post.id}` :
                                  platform === "LINKEDIN" ? `https://linkedin.com/feed/update/urn:li:share:${post.id}` :
                                  platform === "TWITTER" ? `https://twitter.com/caveman/status/${post.id}` :
                                  platform === "YOUTUBE" ? `https://youtube.com/watch?v=cv_${post.id}` :
                                  `https://facebook.com/share/${post.id}`;

          log(`SUCCESS! Post is LIVE.`);
          log(`Post URL: ${mockPublishedUrl}`);
          log(`Capturing high-contrast PNG workspace verification screenshot...`);
          await new Promise((r) => setTimeout(r, 700));
          log(`Saved screenshot image: screenshot_${post.id}_${platform.toLowerCase()}.png`);

          // Append publish results!
          const currentDb = loadDB();
          currentDb.publishResults.push({
            id: "res_" + Math.random().toString(36).substr(2, 9),
            postId: post.id,
            socialAccountId: account ? account.id : "acc_simulated",
            platform,
            status: "PUBLISHED",
            publishedUrl: mockPublishedUrl,
            screenshotUrl: post.mediaUrls[0] || "https://picsum.photos/seed/cave/800/600",
            attemptCount: 1,
            publishedAt: new Date().toISOString()
          });
          saveDB(currentDb);
        }

        // Complete full post status
        const finalDb = loadDB();
        const finalPostIndex = finalDb.posts.findIndex((p: any) => p.id === post.id);
        if (finalPostIndex !== -1) {
          finalDb.posts[finalPostIndex].status = "PUBLISHED";
          finalDb.posts[finalPostIndex].publishedAt = new Date().toISOString();
        }

        // Add a success notification
        finalDb.notifications.push({
          id: "not_" + Math.random().toString(36).substr(2, 9),
          userId: "usr_1",
          type: "PUBLISH_SUCCESS",
          title: `Post "${post.title}" is successfully published!`,
          message: `Playwright engine executed successfully. Content live on: ${post.platforms.join(", ")}`,
          isRead: false,
          createdAt: new Date().toISOString()
        });

        saveDB(finalDb);
        log(`── AUTOMATION TASK COMPLETED SUCCESSFULLY ──`);
        if (streamId) {
          broadcastTerminalLog(streamId, `[PLAYWRIGHT_COMPLETED]`);
        }
      } catch (err: any) {
        log(`[CRITICAL EXCEPTION] Publishing task failed: ${err.message}`);
        const finalDb = loadDB();
        const finalPostIndex = finalDb.posts.findIndex((p: any) => p.id === post.id);
        if (finalPostIndex !== -1) {
          finalDb.posts[finalPostIndex].status = "FAILED";
        }
        finalDb.notifications.push({
          id: "not_" + Math.random().toString(36).substr(2, 9),
          userId: "usr_1",
          type: "PUBLISH_FAILED",
          title: `Publish failed: "${post.title}"`,
          message: err.message || "An exception blocked the Playwright automation script.",
          isRead: false,
          createdAt: new Date().toISOString()
        });
        saveDB(finalDb);
        if (streamId) {
          broadcastTerminalLog(streamId, `[PLAYWRIGHT_FAILED] ${err.message}`);
        }
      }
    };

    runPublishSimulation();
  });

  // POST ACTIONS: Update / Edit Post
  app.patch("/api/posts/:postId", (req, res) => {
    const db = loadDB();
    const { postId } = req.params;
    const index = db.posts.findIndex((p: any) => p.id === postId);
    if (index === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    const { title, caption, mediaUrls, platforms, scheduledAt, status, tags } = req.body;

    db.posts[index] = {
      ...db.posts[index],
      title: title !== undefined ? title : db.posts[index].title,
      caption: caption !== undefined ? caption : db.posts[index].caption,
      mediaUrls: mediaUrls !== undefined ? mediaUrls : db.posts[index].mediaUrls,
      platforms: platforms !== undefined ? platforms : db.posts[index].platforms,
      scheduledAt: scheduledAt !== undefined ? scheduledAt : db.posts[index].scheduledAt,
      status: status !== undefined ? status : db.posts[index].status,
      tags: tags !== undefined ? tags : db.posts[index].tags,
      updatedAt: new Date().toISOString()
    };

    // Keep jobs up-to-date
    const jobIndex = db.scheduledJobs.findIndex((j: any) => j.postId === postId);
    if (jobIndex !== -1) {
      if (scheduledAt) {
        db.scheduledJobs[jobIndex].scheduledAt = scheduledAt;
        db.scheduledJobs[jobIndex].logs.push(`Rescheduled post delivery of ${scheduledAt} by user request.`);
      } else if (status === "DRAFT" || status === "CANCELLED") {
        db.scheduledJobs[jobIndex].status = "cancelled";
        db.scheduledJobs[jobIndex].logs.push("Job cancelled in scheduler queue.");
      }
    }

    saveDB(db);
    res.json(db.posts[index]);
  });

  // POST ACTIONS: Cancel Scheduled Post
  app.post("/api/posts/:postId/cancel", (req, res) => {
    const db = loadDB();
    const { postId } = req.params;
    const index = db.posts.findIndex((p: any) => p.id === postId);
    if (index === -1) {
      return res.status(444).json({ error: "Post not found" });
    }

    db.posts[index].status = "CANCELLED";
    
    const jobIndex = db.scheduledJobs.findIndex((j: any) => j.postId === postId);
    if (jobIndex !== -1) {
      db.scheduledJobs[jobIndex].status = "paused";
      db.scheduledJobs[jobIndex].logs.push("User paused and canceled current scheduled delivery sequence.");
    }

    saveDB(db);
    res.json(db.posts[index]);
  });

  // POST CRUD: Delete Post
  app.delete("/api/posts/:postId", (req, res) => {
    const db = loadDB();
    const { postId } = req.params;
    
    db.posts = db.posts.filter((p: any) => p.id !== postId);
    db.scheduledJobs = db.scheduledJobs.filter((j: any) => j.postId !== postId);
    db.publishResults = db.publishResults.filter((r: any) => r.postId !== postId);

    saveDB(db);
    res.json({ success: true });
  });

  // ACCOUNTS APIs: Fetch all accounts
  app.get("/api/workspaces/:id/accounts", (req, res) => {
    const db = loadDB();
    const workspaceId = req.params.id;
    const accounts = db.socialAccounts.filter((a: any) => a.workspaceId === workspaceId);
    res.json(accounts);
  });

  // ACCOUNTS APIs: Add connected account
  app.post("/api/workspaces/:id/accounts", (req, res) => {
    const db = loadDB();
    const workspaceId = req.params.id;
    const { platform, accountName, accountHandle, proxyUrl, encryptedCookies } = req.body;

    const newAccount = {
      id: "acc_" + Math.random().toString(36).substr(2, 9),
      workspaceId,
      platform,
      accountName,
      accountHandle: accountHandle || "user",
      accountAvatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${accountHandle || accountName}`,
      sessionValid: true,
      lastVerified: new Date().toISOString(),
      proxyUrl: proxyUrl || undefined,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      createdAt: new Date().toISOString()
    };

    db.socialAccounts.push(newAccount);
    saveDB(db);
    res.status(201).json(newAccount);
  });

  // ACCOUNTS APIs: Delete account
  app.delete("/api/accounts/:id", (req, res) => {
    const db = loadDB();
    const { id } = req.params;
    db.socialAccounts = db.socialAccounts.filter((a: any) => a.id !== id);
    saveDB(db);
    res.json({ success: true });
  });

  // ACCOUNTS APIs: Reconnect & Verify Account with terminal logs stream
  app.post("/api/accounts/:accountId/verify", async (req, res) => {
    const db = loadDB();
    const { accountId } = req.params;
    const { streamId } = req.body;

    const index = db.socialAccounts.findIndex((a: any) => a.id === accountId);
    if (index === -1) {
      return res.status(404).json({ error: "Social account not found" });
    }

    const acc = db.socialAccounts[index];

    res.json({ message: "Reconnection process launched." });

    const runVerify = async () => {
      const log = (msg: string) => {
        if (streamId) {
          broadcastTerminalLog(streamId, `[VERIFICATION] ${msg}`);
        }
      };

      try {
        log(`Initiating Playwright validation sequence for account: @${acc.accountHandle}`);
        await new Promise((r) => setTimeout(r, 600));

        if (acc.proxyUrl) {
          log(`Allocating designated proxy gateway node: ${acc.proxyUrl}`);
        }
        log(`Launching Chromium headless automated browser pool...`);
        await new Promise((r) => setTimeout(r, 800));

        log(`Rendering auth cookies payload onto session storage state...`);
        await new Promise((r) => setTimeout(r, 700));

        log(`Navigating to ${acc.platform.toLowerCase()}.com account checkpoint...`);
        await new Promise((r) => setTimeout(r, 1000));

        log(`Checking active feed header elements to ensure authenticated layout state...`);
        await new Promise((r) => setTimeout(r, 800));

        log(`SUCCESS! Sessions verified. Browser profile persistent & active.`);

        const currentDb = loadDB();
        const currentAccIndex = currentDb.socialAccounts.findIndex((a: any) => a.id === accountId);
        if (currentAccIndex !== -1) {
          currentDb.socialAccounts[currentAccIndex].sessionValid = true;
          currentDb.socialAccounts[currentAccIndex].lastVerified = new Date().toISOString();
        }
        saveDB(currentDb);

        if (streamId) {
          broadcastTerminalLog(streamId, `[VERIFICATION_COMPLETED]`);
        }
      } catch (err: any) {
        log(`[CRITICAL] Verification sequence abandoned: ${err.message}`);
        if (streamId) {
          broadcastTerminalLog(streamId, `[VERIFICATION_FAILED] ${err.message}`);
        }
      }
    };

    runVerify();
  });

  // QUEUE APIs: Fetch active queues representing BullMQ
  app.get("/api/workspaces/:id/queue", (req, res) => {
    const db = loadDB();
    const workspaceId = req.params.id;
    
    // Joint posts and jobs details
    const jobs = db.scheduledJobs.map((j: any) => {
      const post = db.posts.find((p: any) => p.id === j.postId);
      return {
        ...j,
        postTitle: post ? post.title : "Unknown Cave Post",
        postPlatforms: post ? post.platforms : [],
        postCaption: post ? post.caption : ""
      };
    });

    res.json(jobs);
  });

  // MEDIA APIs: Fetch files
  app.get("/api/workspaces/:id/media", (req, res) => {
    const db = loadDB();
    const files = db.mediaFiles.filter((m: any) => m.workspaceId === req.params.id);
    res.json(files);
  });

  // MEDIA APIs: Sim upload tag-addition
  app.post("/api/workspaces/:id/media/upload", (req, res) => {
    const db = loadDB();
    const workspaceId = req.params.id;
    const { filename, originalName, mimeType, size, url, tags } = req.body;

    const newFile = {
      id: "med_" + Math.random().toString(36).substr(2, 9),
      workspaceId,
      uploadedById: "usr_1",
      filename: filename || "upload.jpg",
      originalName: originalName || "upload.jpg",
      mimeType: mimeType || "image/jpeg",
      size: size || 102400,
      url: url || "https://picsum.photos/seed/cave/800/600",
      tags: tags || ["upload"],
      createdAt: new Date().toISOString()
    };

    db.mediaFiles.push(newFile);
    saveDB(db);
    res.status(201).json(newFile);
  });

  // MEDIA APIs: Delete photo
  app.delete("/api/media/:mediaId", (req, res) => {
    const db = loadDB();
    db.mediaFiles = db.mediaFiles.filter((m: any) => m.id !== req.params.mediaId);
    saveDB(db);
    res.json({ success: true });
  });

  // NOTIFICATION APIs: Getting notifications list
  app.get("/api/notifications", (req, res) => {
    const db = loadDB();
    res.json(db.notifications);
  });

  // NOTIFICATION APIs: Make Read
  app.patch("/api/notifications/:id/read", (req, res) => {
    const db = loadDB();
    const index = db.notifications.findIndex((n: any) => n.id === req.params.id);
    if (index !== -1) {
      db.notifications[index].isRead = true;
    }
    saveDB(db);
    res.json({ success: true });
  });

  // NOTIFICATION APIs: Clear all
  app.delete("/api/notifications", (req, res) => {
    const db = loadDB();
    db.notifications = [];
    saveDB(db);
    res.json({ success: true });
  });

  // ANALYTICS OVERVIEW: Get stats aggregator
  app.get("/api/workspaces/:id/analytics/overview", (req, res) => {
    const db = loadDB();
    const workspaceId = req.params.id;

    // Filter content
    const posts = db.posts.filter((p: any) => p.workspaceId === workspaceId);
    const accounts = db.socialAccounts.filter((a: any) => a.workspaceId === workspaceId);

    const totalPostsCount = posts.length;
    const publishedPosts = posts.filter((p: any) => p.status === "PUBLISHED");
    const scheduledPosts = posts.filter((p: any) => p.status === "SCHEDULED");
    const failedPosts = posts.filter((p: any) => p.status === "FAILED");

    // Success rate
    const totalResults = db.publishResults.length;
    const successResult = db.publishResults.filter((r: any) => r.status === "PUBLISHED").length;
    const successPercentage = totalResults > 0 ? Math.round((successResult / totalResults) * 100) : 95;

    // Platform share counts
    const platformCounts: { [key: string]: number } = {
      TWITTER: 0,
      INSTAGRAM: 0,
      LINKEDIN: 0,
      YOUTUBE: 0,
      FACEBOOK: 0
    };

    posts.forEach((p: any) => {
      p.platforms.forEach((plat: string) => {
        if (platformCounts[plat] !== undefined) {
          platformCounts[plat]++;
        }
      });
    });

    res.json({
      summary: {
        totalPosts: totalPostsCount,
        published: publishedPosts.length,
        scheduled: scheduledPosts.length,
        failed: failedPosts.length,
        connectedAccounts: accounts.length,
        successRate: successPercentage
      },
      auditLogs: db.auditLogs,
      platformStats: Object.keys(platformCounts).map((key) => ({
        platform: key as Platform,
        count: platformCounts[key]
      })),
      resultsHistory: db.publishResults
    });
  });

  // BILLING PLANS
  app.get("/api/billing/plans", (req, res) => {
    res.json({
      starter: { name: "Starter", price: "$29", accounts: 5, posts: 30, limitGb: 2, features: ["1 Workspace", "Basic Analytics"] },
      pro: { name: "Pro", price: "$79", accounts: 15, posts: 200, limitGb: 10, features: ["3 Workspaces", "AI Content Assist", "Automated Playwright Queue"] },
      agency: { name: "Agency", price: "$249", accounts: "Unlimited", posts: "Unlimited", limitGb: 100, features: ["Unlimited Workspaces", "White Label branding", "Primal Dedicated Proxy allocation"] }
    });
  });

  // Setup static file serving or Vite Dev Middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started. Accessible at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
