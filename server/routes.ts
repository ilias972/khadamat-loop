import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertProjectSchema, insertMessageSchema, insertFavoriteSchema, insertReviewSchema } from "@shared/schema";
import { serviceCatalog } from "./serviceCatalog";
import cors from "cors";
import { normalizeString } from "@shared/normalize";
import { createRateLimit } from "./security/middleware";

// Import des middlewares de sécurité
import { 
  helmetConfig, 
  corsOptions, 
  apiRateLimit,
  captureClientIP,
  detectSuspiciousActivity,
  sanitizeInput
} from "./security/middleware";
import { SecurityLogger } from "./security/logger";
import securityRoutes from "./security/routes";

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: b.length + 1 }, () => Array(a.length + 1).fill(0));
  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
      }
    }
  }
  return matrix[b.length][a.length];
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Middlewares de sécurité globaux
  app.use(helmetConfig);
  app.use(cors(corsOptions));
  app.use(captureClientIP);
  app.use(detectSuspiciousActivity);
  app.use(sanitizeInput);
  app.use(apiRateLimit);

  const providerSuggestRate = createRateLimit(
    60 * 1000,
    60,
    "Too many suggestions"
  );
  const serviceSuggestRate = createRateLimit(
    60 * 1000,
    60,
    "Too many suggestions"
  );

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  // Routes de sécurité
  app.use("/api/auth", securityRoutes);
    // Catalogue services
    app.get("/api/services/catalog", (req, res) => {
    try {
      const groupBy = req.query.groupBy;
      if (groupBy === "category") {
        const categoriesMap = new Map<string, { code: string; name_fr: string; name_ar: string; services: { id: number; code: string; slug: string; name_fr: string; name_ar: string }[] }>();
        for (const s of serviceCatalog) {
          let category = categoriesMap.get(s.category_code);
          if (!category) {
            category = { code: s.category_code, name_fr: s.name_fr, name_ar: s.name_ar, services: [] };
            categoriesMap.set(s.category_code, category);
          }
          category.services.push({ id: s.id, code: s.code, slug: s.slug, name_fr: s.name_fr, name_ar: s.name_ar });
        }
        const categories = Array.from(categoriesMap.values());
        res.json({ success: true, data: { categories } });
      } else {
        res.json({ success: true, data: serviceCatalog });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch catalog" });
    }
    });
    app.get("/api/services/suggest", serviceSuggestRate, async (req, res) => {
      try {
        const qRaw = (req.query.q as string) || "";
        const cityRaw = (req.query.city as string) || "";
        const limitParam = parseInt(req.query.limit as string, 10);
        const limit = Math.min(Math.max(isNaN(limitParam) ? 8 : limitParam, 1), 20);
        const normalized = normalizeString(qRaw);
        if (!normalized) {
          return res.json({ success: true, data: { items: [] } });
        }
        SecurityLogger.logSensitiveOperation(0, "SERVICE_SUGGEST_QUERY", { q: normalized }, req.ip);
        const providers = cityRaw ? await storage.getAllProviders() : [];
        const normalizedCity = normalizeString(cityRaw);
        const scored = serviceCatalog
          .map((s) => {
            const name = normalizeString(s.name_fr);
            if (name.startsWith(normalized)) return { s, score: 0 };
            if (name.includes(" " + normalized)) return { s, score: 1 };
            if (name.includes(normalized)) return { s, score: 2 };
            if (levenshtein(name, normalized) <= 1) return { s, score: 3 };
            return null;
          })
          .filter((x): x is { s: typeof serviceCatalog[number]; score: number } => x !== null)
          .sort((a, b) => a.score - b.score)
          .slice(0, limit);
        const items = scored.map(({ s }) => {
          let providersCountInCity = 0;
          if (cityRaw) {
            providersCountInCity = providers.filter((p) => {
              const matchCity = normalizeString(p.user.location || "").includes(normalizedCity);
              const matchService = p.specialties?.some((sp) => normalizeString(sp).includes(normalizeString(s.name_fr)));
              return matchCity && matchService;
            }).length;
          }
          return {
            id: s.id,
            code: s.code,
            slug: s.slug,
            name_fr: s.name_fr,
            name_ar: s.name_ar,
            providersCountInCity,
          };
        });
        items.sort((a, b) => b.providersCountInCity - a.providersCountInCity);
        res.json({ success: true, data: { items } });
      } catch (error) {
        res.status(500).json({ success: false, error: "Failed to suggest services" });
      }
    });
  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/services/popular", async (req, res) => {
    try {
      const services = await storage.getPopularServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular services" });
    }
  });

  app.get("/api/services/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const services = await storage.getServicesByCategory(category);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services by category" });
    }
  });

  // Provider suggestions
  app.get("/api/providers/suggest", providerSuggestRate, async (req, res) => {
    try {
      const qRaw = (req.query.q as string) || "";
      const cityRaw = (req.query.city as string) || "";
      const limitParam = parseInt(req.query.limit as string, 10);
      const limit = Math.min(Math.max(isNaN(limitParam) ? 8 : limitParam, 1), 20);
      const normalizedQuery = normalizeString(qRaw);
      if (!normalizedQuery) {
        return res.json({ success: true, data: { items: [] } });
      }
      SecurityLogger.logSensitiveOperation(0, "PROVIDER_SUGGEST_QUERY", { q: normalizedQuery }, req.ip);

      const allProviders = await storage.getAllProviders();
      const normalizedCity = normalizeString(cityRaw);
      const filtered = allProviders.filter(
        (p) =>
          p.user.isVerified &&
          (!normalizedCity ||
            normalizeString(p.user.location || "").includes(normalizedCity))
      );

      const scored = filtered
        .map((p) => {
          const name =
            p.user.displayNameNormalized ||
            normalizeString(`${p.user.firstName} ${p.user.lastName}`);
          let score = 4;
          if (name === normalizedQuery) score = 0;
          else if (name.split(" ").some((t) => t.startsWith(normalizedQuery))) score = 1;
          else if (name.includes(normalizedQuery)) score = 2;
          else if (levenshtein(name, normalizedQuery) <= 2) score = 3;
          return { provider: p, score };
        })
        .filter((s) => s.score < 4)
        .sort((a, b) => a.score - b.score)
        .slice(0, limit)
        .map(({ provider }) => ({
          id: provider.id,
          slug: provider.user.username,
          displayName: `${provider.user.firstName} ${provider.user.lastName}`,
          mainCity: provider.user.location,
          topServices: provider.specialties?.slice(0, 3),
          rating: provider.rating,
        }));

      res.json({ success: true, data: { items: scored } });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to suggest providers" });
    }
  });

  app.get("/api/providers/search", async (req, res) => {
    try {
      const { q, service, city } = req.query;
      const normalizedQuery = normalizeString((q as string) || "");
      let providers = (await storage.getAllProviders()).filter(p => p.user.isVerified);
      if (service) {
        const serviceLower = (service as string).toLowerCase();
        providers = providers.filter(p =>
          p.specialties?.some(s => s.toLowerCase().includes(serviceLower))
        );
      }
      if (city) {
        const cityLower = (city as string).toLowerCase();
        providers = providers.filter(p => p.user.location?.toLowerCase().includes(cityLower));
      }
      if (normalizedQuery) {
        providers = providers.filter(p => {
          const name =
            p.user.displayNameNormalized ||
            normalizeString(`${p.user.firstName} ${p.user.lastName}`);
          return name.includes(normalizedQuery);
        });
      }
      providers.sort((a, b) => {
        const clubDiff = (b.user.isClubPro ? 1 : 0) - (a.user.isClubPro ? 1 : 0);
        if (clubDiff !== 0) return clubDiff;
        const ratingA = parseFloat(a.rating || "0");
        const ratingB = parseFloat(b.rating || "0");
        return ratingB - ratingA;
      });
      res.json({ success: true, data: { items: providers } });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to search providers" });
    }
  });

  // Providers routes
  app.get("/api/providers", async (req, res) => {
    try {
      const { service, clubPro } = req.query;
      
      let providers;
      if (clubPro === 'true') {
        providers = await storage.getClubProProviders();
      } else if (service) {
        providers = await storage.getProvidersByService(service as string);
      } else {
        providers = await storage.getAllProviders();
      }
      
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch providers" });
    }
  });

  app.get("/api/providers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const provider = await storage.getProvider(id);
      
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      
      res.json(provider);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch provider" });
    }
  });

  // Users routes
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Remove password from response
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const { clientId } = req.query;
      
      let projects;
      if (clientId) {
        projects = await storage.getProjectsByClient(parseInt(clientId as string));
      } else {
        projects = await storage.getAllProjects();
      }
      
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Messages routes
  app.get("/api/messages", async (req, res) => {
    try {
      const { userId, otherUserId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      
      let messages;
      if (otherUserId) {
        messages = await storage.getMessagesBetweenUsers(
          parseInt(userId as string),
          parseInt(otherUserId as string)
        );
      } else {
        messages = await storage.getMessagesByUser(parseInt(userId as string));
      }
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  app.patch("/api/messages/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.markMessageAsRead(id);
      
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Favorites routes
  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const favoriteData = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.addFavorite(favoriteData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid favorite data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites", async (req, res) => {
    try {
      const { userId, providerId } = req.body;
      const success = await storage.removeFavorite(userId, providerId);
      
      if (!success) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      res.json({ message: "Favorite removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  app.get("/api/favorites/check/:userId/:providerId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const providerId = parseInt(req.params.providerId);
      const isFavorite = await storage.isFavorite(userId, providerId);
      res.json({ isFavorite });
    } catch (error) {
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  // Reviews routes
  app.get("/api/reviews/provider/:providerId", async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      const reviews = await storage.getProviderReviews(providerId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Search route
  app.get("/api/search", async (req, res) => {
    try {
      const { q, location } = req.query;
      const query = (q as string)?.toLowerCase() || "";
      
      const allProviders = await storage.getAllProviders();
      const filteredProviders = allProviders.filter(provider => {
        const matchesQuery = !query || 
          provider.specialties?.some(specialty => 
            specialty.toLowerCase().includes(query)
          ) ||
          provider.user.firstName.toLowerCase().includes(query) ||
          provider.user.lastName.toLowerCase().includes(query);
          
        const matchesLocation = !location || 
          provider.user.location?.toLowerCase().includes((location as string).toLowerCase());
          
        return matchesQuery && matchesLocation;
      });
      
      res.json(filteredProviders);
    } catch (error) {
      res.status(500).json({ message: "Failed to search providers" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
