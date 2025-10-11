import {
  users,
  services,
  providers,
  projects,
  messages,
  favorites,
  reviews,
  type User,
  type InsertUser,
  type Service,
  type InsertService,
  type Provider,
  type InsertProvider,
  type ProviderWithUser,
  type Project,
  type InsertProject,
  type ProjectWithClient,
  type Message,
  type InsertMessage,
  type MessageWithUsers,
  type Favorite,
  type InsertFavorite,
  type Review,
  type InsertReview,
} from "@shared/schema";
import { readFileSync } from "node:fs";
import { normalizeString } from "@shared/normalize";

type UserSeed = Omit<User, "createdAt"> & { createdAt?: string | null };
type ProviderSeed = Provider;
type ServiceSeed = Service;

function loadJson<T>(relativePath: string): T {
  const data = readFileSync(new URL(relativePath, import.meta.url), "utf-8");
  return JSON.parse(data) as T;
}

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Services
  getAllServices(): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  getPopularServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;

  // Providers
  getAllProviders(): Promise<ProviderWithUser[]>;
  getProvider(id: number): Promise<ProviderWithUser | undefined>;
  getProvidersByService(serviceCategory: string): Promise<ProviderWithUser[]>;
  getClubProProviders(): Promise<ProviderWithUser[]>;
  createProvider(provider: InsertProvider): Promise<Provider>;
  updateProvider(id: number, updates: Partial<Provider>): Promise<Provider | undefined>;

  // Projects
  getAllProjects(): Promise<ProjectWithClient[]>;
  getProject(id: number): Promise<ProjectWithClient | undefined>;
  getProjectsByClient(clientId: number): Promise<ProjectWithClient[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;

  // Messages
  getMessagesBetweenUsers(userId1: number, userId2: number): Promise<MessageWithUsers[]>;
  getMessagesByUser(userId: number): Promise<MessageWithUsers[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(messageId: number): Promise<Message | undefined>;

  // Favorites
  getUserFavorites(userId: number): Promise<ProviderWithUser[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, providerId: number): Promise<boolean>;
  isFavorite(userId: number, providerId: number): Promise<boolean>;

  // Reviews
  getProviderReviews(providerId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private providers: Map<number, Provider>;
  private projects: Map<number, Project>;
  private messages: Map<number, Message>;
  private favorites: Map<number, Favorite>;
  private reviews: Map<number, Review>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.providers = new Map();
    this.projects = new Map();
    this.messages = new Map();
    this.favorites = new Map();
    this.reviews = new Map();
    this.currentId = 1;

    this.seedData();
  }

  private seedData() {
    const defaultServices = loadJson<ServiceSeed[]>("../backend/prisma/data/services.json");

    defaultServices.forEach(service => {
      this.services.set(service.id, service);
    });

    const defaultUsersSeed = loadJson<UserSeed[]>("../backend/prisma/data/users.json");
    const defaultUsers: User[] = defaultUsersSeed.map(user => ({
      ...user,
      displayNameNormalized: user.displayNameNormalized ?? normalizeString(`${user.firstName} ${user.lastName}`),
      createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
    }));

    defaultUsers.forEach(user => {
      this.users.set(user.id, user);
    });

    const defaultProviders = loadJson<ProviderSeed[]>("../backend/prisma/data/providers.json");

    defaultProviders.forEach(provider => {
      this.providers.set(provider.id, provider);
    });

    this.currentId = 5;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      firstName: insertUser.firstName,
      lastName: insertUser.lastName,
      displayNameNormalized: normalizeString(`${insertUser.firstName} ${insertUser.lastName}`),
      phone: insertUser.phone ?? null,
      avatar: insertUser.avatar ?? null,
      userType: insertUser.userType,
      isClubPro: insertUser.isClubPro ?? null,
      isVerified: insertUser.isVerified ?? null,
      location: insertUser.location ?? null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const newFirst = updates.firstName ?? user.firstName;
    const newLast = updates.lastName ?? user.lastName;
    const updatedUser = {
      ...user,
      ...updates,
      displayNameNormalized: normalizeString(`${newFirst} ${newLast}`),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      service => service.category === category
    );
  }

  async getPopularServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      service => service.isPopular
    );
  }

  async createService(service: InsertService): Promise<Service> {
    const id = this.currentId++;
    const newService: Service = {
      id,
      name: service.name,
      nameAr: service.nameAr ?? null,
      description: service.description ?? null,
      descriptionAr: service.descriptionAr ?? null,
      category: service.category,
      icon: service.icon,
      isPopular: service.isPopular ?? null,
    };
    this.services.set(id, newService);
    return newService;
  }

  // Providers
  async getAllProviders(): Promise<ProviderWithUser[]> {
    const providersWithUsers: ProviderWithUser[] = [];

    for (const provider of Array.from(this.providers.values())) {
      const user = this.users.get(provider.userId);
      if (user) {
        providersWithUsers.push({ ...provider, user });
      }
    }
    
    return providersWithUsers;
  }

  async getProvider(id: number): Promise<ProviderWithUser | undefined> {
    const provider = this.providers.get(id);
    if (!provider) return undefined;
    
    const user = this.users.get(provider.userId);
    if (!user) return undefined;
    
    return { ...provider, user };
  }

  async getProvidersByService(serviceCategory: string): Promise<ProviderWithUser[]> {
    const allProviders = await this.getAllProviders();
    return allProviders.filter(provider => 
      provider.specialties?.some(specialty => 
        specialty.toLowerCase().includes(serviceCategory.toLowerCase())
      )
    );
  }

  async getClubProProviders(): Promise<ProviderWithUser[]> {
    const allProviders = await this.getAllProviders();
    return allProviders.filter(provider => provider.user.isClubPro);
  }

  async createProvider(provider: InsertProvider): Promise<Provider> {
    const id = this.currentId++;
    const newProvider: Provider = {
      id,
      userId: provider.userId,
      specialties: provider.specialties ?? null,
      experience: provider.experience ?? null,
      rating: provider.rating ?? null,
      reviewCount: provider.reviewCount ?? null,
      isOnline: provider.isOnline ?? null,
      hourlyRate: provider.hourlyRate ?? null,
      bio: provider.bio ?? null,
      bioAr: provider.bioAr ?? null,
    };
    this.providers.set(id, newProvider);
    return newProvider;
  }

  async updateProvider(id: number, updates: Partial<Provider>): Promise<Provider | undefined> {
    const provider = this.providers.get(id);
    if (!provider) return undefined;
    
    const updatedProvider = { ...provider, ...updates };
    this.providers.set(id, updatedProvider);
    return updatedProvider;
  }

  // Projects
  async getAllProjects(): Promise<ProjectWithClient[]> {
    const projectsWithClients: ProjectWithClient[] = [];

    for (const project of Array.from(this.projects.values())) {
      const client = this.users.get(project.clientId);
      if (client) {
        projectsWithClients.push({ ...project, client });
      }
    }
    
    return projectsWithClients;
  }

  async getProject(id: number): Promise<ProjectWithClient | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const client = this.users.get(project.clientId);
    if (!client) return undefined;
    
    return { ...project, client };
  }

  async getProjectsByClient(clientId: number): Promise<ProjectWithClient[]> {
    const allProjects = await this.getAllProjects();
    return allProjects.filter(project => project.clientId === clientId);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const newProject: Project = {
      id,
      clientId: project.clientId,
      title: project.title,
      description: project.description,
      serviceCategory: project.serviceCategory,
      budget: project.budget ?? null,
      location: project.location ?? null,
      urgency: project.urgency ?? null,
      status: project.status ?? null,
      createdAt: new Date(),
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...updates };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  // Messages
  async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<MessageWithUsers[]> {
    const messagesWithUsers: MessageWithUsers[] = [];

    for (const message of Array.from(this.messages.values())) {
      if (
        (message.senderId === userId1 && message.receiverId === userId2) ||
        (message.senderId === userId2 && message.receiverId === userId1)
      ) {
        const sender = this.users.get(message.senderId);
        const receiver = this.users.get(message.receiverId);
        
        if (sender && receiver) {
          messagesWithUsers.push({ ...message, sender, receiver });
        }
      }
    }
    
    return messagesWithUsers.sort((a, b) => 
      new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
    );
  }

  async getMessagesByUser(userId: number): Promise<MessageWithUsers[]> {
    const messagesWithUsers: MessageWithUsers[] = [];

    for (const message of Array.from(this.messages.values())) {
      if (message.senderId === userId || message.receiverId === userId) {
        const sender = this.users.get(message.senderId);
        const receiver = this.users.get(message.receiverId);
        
        if (sender && receiver) {
          messagesWithUsers.push({ ...message, sender, receiver });
        }
      }
    }
    
    return messagesWithUsers.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentId++;
    const newMessage: Message = {
      id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      content: message.content,
      isRead: message.isRead ?? null,
      createdAt: new Date(),
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async markMessageAsRead(messageId: number): Promise<Message | undefined> {
    const message = this.messages.get(messageId);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, isRead: true };
    this.messages.set(messageId, updatedMessage);
    return updatedMessage;
  }

  // Favorites
  async getUserFavorites(userId: number): Promise<ProviderWithUser[]> {
    const userFavorites = Array.from(this.favorites.values()).filter(
      favorite => favorite.userId === userId
    );
    
    const favoriteProviders: ProviderWithUser[] = [];
    
    for (const favorite of userFavorites) {
      const provider = await this.getProvider(favorite.providerId);
      if (provider) {
        favoriteProviders.push(provider);
      }
    }
    
    return favoriteProviders;
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentId++;
    const newFavorite: Favorite = {
      id,
      userId: favorite.userId,
      providerId: favorite.providerId,
      createdAt: new Date(),
    };
    this.favorites.set(id, newFavorite);
    return newFavorite;
  }

  async removeFavorite(userId: number, providerId: number): Promise<boolean> {
    for (const [id, favorite] of Array.from(this.favorites.entries())) {
      if (favorite.userId === userId && favorite.providerId === providerId) {
        this.favorites.delete(id);
        return true;
      }
    }
    return false;
  }

  async isFavorite(userId: number, providerId: number): Promise<boolean> {
    return Array.from(this.favorites.values()).some(
      favorite => favorite.userId === userId && favorite.providerId === providerId
    );
  }

  // Reviews
  async getProviderReviews(providerId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.providerId === providerId
    );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentId++;
    const newReview: Review = {
      id,
      clientId: review.clientId,
      providerId: review.providerId,
      rating: review.rating,
      comment: review.comment ?? null,
      projectId: review.projectId ?? null,
      createdAt: new Date(),
    };
    this.reviews.set(id, newReview);
    return newReview;
  }
}

export const storage = new MemStorage();
