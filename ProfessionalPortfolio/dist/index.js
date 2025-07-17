// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  contacts;
  currentUserId;
  currentContactId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.contacts = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async createContact(insertContact) {
    const id = this.currentContactId++;
    const contact = {
      id,
      name: insertContact.name,
      email: insertContact.email,
      subject: insertContact.subject || null,
      message: insertContact.message,
      createdAt: /* @__PURE__ */ new Date(),
      isRead: false
    };
    this.contacts.set(id, contact);
    return contact;
  }
  async getContacts() {
    return Array.from(this.contacts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
  async markContactAsRead(id) {
    const contact = this.contacts.get(id);
    if (contact) {
      contact.isRead = true;
      this.contacts.set(id, contact);
    }
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  subject: true,
  message: true
});

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.json({
        success: true,
        message: "Thank you for your message! I'll get back to you soon.",
        contact: { id: contact.id }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to send message. Please try again."
        });
      }
    }
  });
  app2.get("/api/contacts", async (req, res) => {
    try {
      const contacts2 = await storage.getContacts();
      res.json(contacts2);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch contacts"
      });
    }
  });
  app2.get("/api/resume/download", (req, res) => {
    try {
      const resumeContent = `
HARVINDER SINGH
Full Stack Developer

CONTACT INFORMATION
Email: harvinder.singh@email.com
Phone: +91 XXXXX XXXXX
LinkedIn: linkedin.com/in/harvinder-singh
GitHub: github.com/harvinder-singh

SUMMARY
Passionate full-stack developer with strong fundamentals in modern web technologies.
Fresh graduate with expertise in React, Node.js, and database management.

TECHNICAL SKILLS
Frontend: React.js, Vue.js, JavaScript (ES6+), TypeScript, HTML5, CSS3, Responsive Design
Backend: Node.js, Express.js, Python, Django, RESTful APIs, GraphQL
Database: MongoDB, PostgreSQL, MySQL, Redis
Cloud & Tools: AWS, Docker, Git, VS Code, Postman

EDUCATION
Bachelor of Computer Science
[University Name] - [Year]

PROJECTS
1. Full-Stack E-Commerce Platform
   - Complete e-commerce solution with payment integration
   - Technologies: React, Node.js, MongoDB, Stripe API

2. Collaborative Task Management App
   - Real-time collaborative application with team workspaces
   - Technologies: Vue.js, Socket.io, Express, PostgreSQL

3. Weather Analytics Dashboard
   - Interactive weather dashboard with data visualization
   - Technologies: React, D3.js, Weather API, Chart.js

CERTIFICATIONS
- Web Development Certification
- JavaScript Fundamentals
- Database Management Systems
      `;
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Content-Disposition", 'attachment; filename="Harvinder_Singh_Resume.txt"');
      res.send(resumeContent);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to download resume"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen(port, () => {
    log(`\u2705 Server is running at http://localhost:${port}`);
  });
})();
