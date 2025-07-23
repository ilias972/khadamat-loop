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
    // Seed services
    const defaultServices: Service[] = [
      {
        id: 1,
        name: "Plomberie",
        nameAr: "السباكة",
        description: "Réparations, installations et dépannages d'urgence 24/7",
        descriptionAr: "إصلاحات وتركيبات وخدمات طوارئ على مدار الساعة",
        category: "home_maintenance",
        icon: "wrench",
        isPopular: true,
      },
      {
        id: 2,
        name: "Électricité",
        nameAr: "الكهرباء",
        description: "Installation électrique, dépannage et mise aux normes",
        descriptionAr: "تركيب كهربائي وإصلاحات وتحديث المعايير",
        category: "home_maintenance",
        icon: "bolt",
        isPopular: true,
      },
      {
        id: 3,
        name: "Ménage",
        nameAr: "التنظيف",
        description: "Services de nettoyage pour particuliers et entreprises",
        descriptionAr: "خدمات التنظيف للأفراد والشركات",
        category: "cleaning",
        icon: "broom",
        isPopular: true,
      },
      {
        id: 4,
        name: "Jardinage",
        nameAr: "البستنة",
        description: "Entretien d'espaces verts et aménagement paysager",
        descriptionAr: "صيانة المساحات الخضراء وتنسيق الحدائق",
        category: "outdoor",
        icon: "seedling",
        isPopular: true,
      },
    ];

    defaultServices.forEach(service => {
      this.services.set(service.id, service);
    });

    // Seed users
    const defaultUsers: User[] = [
      {
        id: 1,
        username: "ahmed_electricien",
        email: "ahmed@example.com",
        password: "hashed_password",
        firstName: "Ahmed",
        lastName: "Benali",
        phone: "+212612345678",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        userType: "provider",
        isClubPro: true,
        isVerified: true,
        location: "Casablanca",
        createdAt: new Date(),
      },
      {
        id: 2,
        username: "fatima_menage",
        email: "fatima@example.com",
        password: "hashed_password",
        firstName: "Fatima",
        lastName: "Zahra",
        phone: "+212623456789",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        userType: "provider",
        isClubPro: true,
        isVerified: true,
        location: "Rabat",
        createdAt: new Date(),
      },
      {
        id: 3,
        username: "omar_plombier",
        email: "omar@example.com",
        password: "hashed_password",
        firstName: "Omar",
        lastName: "Alaoui",
        phone: "+212634567890",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        userType: "provider",
        isClubPro: false,
        isVerified: true,
        location: "Marrakech",
        createdAt: new Date(),
      },
    ];

    defaultUsers.forEach(user => {
      this.users.set(user.id, user);
    });

    // Seed providers
    const defaultProviders: Provider[] = [
      {
        id: 1,
        userId: 1,
        specialties: ["Électricité", "Domotique"],
        experience: 8,
        rating: "4.9",
        reviewCount: 127,
        isOnline: true,
        hourlyRate: "150.00",
        bio: "Électricien professionnel avec 8 ans d'expérience",
        bioAr: "كهربائي محترف مع 8 سنوات من الخبرة",
      },
      {
        id: 2,
        userId: 2,
        specialties: ["Ménage", "Repassage"],
        experience: 5,
        rating: "4.8",
        reviewCount: 89,
        isOnline: true,
        hourlyRate: "80.00",
        bio: "Spécialiste du ménage et du repassage",
        bioAr: "متخصصة في التنظيف والكي",
      },
      {
        id: 3,
        userId: 3,
        specialties: ["Plomberie", "Urgence 24/7"],
        experience: 12,
        rating: "4.7",
        reviewCount: 64,
        isOnline: false,
        hourlyRate: "120.00",
        bio: "Plombier expert disponible en urgence",
        bioAr: "سباك خبير متاح للطوارئ",
      },
    ];

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
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
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
    const newService: Service = { ...service, id };
    this.services.set(id, newService);
    return newService;
  }

  // Providers
  async getAllProviders(): Promise<ProviderWithUser[]> {
    const providersWithUsers: ProviderWithUser[] = [];
    
    for (const provider of this.providers.values()) {
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
    const newProvider: Provider = { ...provider, id };
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
    
    for (const project of this.projects.values()) {
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
      ...project, 
      id,
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
    
    for (const message of this.messages.values()) {
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
    
    for (const message of this.messages.values()) {
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
      ...message, 
      id,
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
      ...favorite, 
      id,
      createdAt: new Date(),
    };
    this.favorites.set(id, newFavorite);
    return newFavorite;
  }

  async removeFavorite(userId: number, providerId: number): Promise<boolean> {
    for (const [id, favorite] of this.favorites.entries()) {
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
      ...review, 
      id,
      createdAt: new Date(),
    };
    this.reviews.set(id, newReview);
    return newReview;
  }
}

export const storage = new MemStorage();
