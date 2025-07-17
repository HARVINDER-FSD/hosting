import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
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

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch contacts" 
      });
    }
  });

  // Resume download endpoint
  app.get("/api/resume/download", (req, res) => {
    try {
      // In a real application, this would serve an actual resume file
      // For demo purposes, we'll create a simple response
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

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="Harvinder_Singh_Resume.txt"');
      res.send(resumeContent);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to download resume" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
