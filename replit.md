# Khadamat - Moroccan Service Platform

## Overview

Khadamat is a comprehensive service marketplace platform that connects clients with professional service providers in Morocco. The application features a modern React-based frontend with Express backend, built with TypeScript and styled using Tailwind CSS with shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with **TypeScript** for type safety
- **Vite** as the build tool and development server
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **Tailwind CSS** with **shadcn/ui** component library for styling
- **Context API** for global state management (language switching)

### Backend Architecture
- **Express.js** server with TypeScript
- RESTful API design with structured route handling
- Middleware for request logging and error handling
- Integration with Vite in development mode for seamless full-stack development

### Database Layer
- **Drizzle ORM** for database interactions
- **PostgreSQL** as the primary database (configured for Neon serverless)
- Well-defined schema with tables for users, services, providers, projects, messages, favorites, and reviews
- Type-safe database operations with Zod validation

## Key Components

### User Management System
- **Multi-user types**: Clients and service providers
- **Club Pro membership**: Premium tier for verified providers
- **Four-step registration** process with identity verification
- User authentication and session management

### Service Discovery
- **Smart search** functionality with autocomplete and geolocation
- **Service categorization** with popular services highlighting
- **Provider filtering** and sorting capabilities
- **Bilingual support** (French/Arabic) with RTL layout support

### Communication System
- **Real-time messaging** between clients and providers
- **Audio/video calling** integration
- **File sharing** capabilities
- **Notification system** for updates

### UI/UX Features
- **Responsive design** with mobile-first approach
- **Glassmorphism effects** and modern visual styling
- **Mobile tab bar** for native app-like experience
- **Progressive enhancement** with skeleton loading states

## Data Flow

1. **User Registration/Authentication**
   - Multi-step registration with form validation
   - User type selection (client/provider)
   - Identity verification process

2. **Service Discovery**
   - Search with intelligent suggestions
   - Filter by location, service type, and provider status
   - Real-time availability checking

3. **Provider-Client Interaction**
   - Direct messaging system
   - Project posting and proposal system
   - Rating and review mechanism

4. **Data Persistence**
   - All interactions stored in PostgreSQL
   - Real-time updates via optimistic UI patterns
   - Caching strategies with TanStack Query

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Hook Form)
- Radix UI components for accessible UI primitives
- Lucide React for consistent iconography
- Date-fns for date manipulation

### Database & API
- Drizzle ORM with PostgreSQL dialect
- Neon serverless database connection
- Zod for schema validation and type inference

### Development Tools
- TypeScript for type safety
- Vite with React plugin
- ESBuild for production bundling
- PostCSS with Tailwind CSS

### Third-party Services
- Replit-specific plugins for development environment
- Connect-pg-simple for session storage

## Deployment Strategy

### Development Environment
- **Hot Module Replacement** via Vite
- **Integrated development server** running both frontend and backend
- **TypeScript compilation** with strict type checking
- **Environment-specific configurations**

### Production Build
- **Static asset generation** via Vite build
- **Backend bundling** with ESBuild
- **Single-process deployment** with Express serving static files
- **Environment variable configuration** for database connections

### Database Management
- **Schema migrations** via Drizzle Kit
- **Development database push** for rapid prototyping
- **Production-ready PostgreSQL** setup with proper indexing

The architecture emphasizes developer experience with hot reloading, type safety, and modern tooling while maintaining production readiness with proper error handling, logging, and scalable database design.