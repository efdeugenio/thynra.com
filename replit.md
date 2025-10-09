# Thynra - AI Subscription Service

## Overview

Thynra is a modern AI subscription service platform that provides on-demand AI solutions to clients. The application serves as a landing page and customer portal for an AI consulting service that offers fixed monthly pricing for AI projects including chatbots, data analysis, ML models, automation, and other AI-powered solutions.

**Brand Identity:**
- Company Name: Thynra
- Domain: Thynra.com
- Slogan: "Thinking for the new era."

The platform is built as a full-stack TypeScript application with a React frontend and Express.js backend, designed to handle customer inquiries and booking requests through form submissions that are stored in a PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React 18 and TypeScript, utilizing modern development patterns:

- **Component Library**: Radix UI components with shadcn/ui for consistent, accessible UI components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and API data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth UI transitions and interactions
- **Forms**: React Hook Form with Zod validation for type-safe form handling

The frontend follows a component-based architecture with clear separation between UI components, pages, and business logic. Components are organized into reusable UI elements and feature-specific components.

### Backend Architecture
The server-side application uses Express.js with TypeScript in ESM format:

- **API Design**: RESTful endpoints for contact and booking form submissions
- **Validation**: Zod schemas for runtime type validation and data integrity
- **Storage Interface**: Abstracted storage layer with both in-memory and database implementations
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Development Tools**: Hot reloading with Vite integration for development workflow

The backend implements a clean architecture pattern with separated concerns for routing, validation, and data persistence.

### Database Schema
The application uses PostgreSQL with Drizzle ORM for type-safe database operations:

- **Users Table**: Basic user management with username/password authentication
- **Contact Requests**: Customer inquiry form submissions with optional company and phone fields
- **Booking Requests**: Meeting/consultation booking requests with preferred time slots

All tables use UUID primary keys and include proper timestamps for audit trails.

### Build and Deployment
The application uses a modern build pipeline:

- **Frontend**: Vite for fast development and optimized production builds
- **Backend**: esbuild for server-side bundling with ESM output
- **Database**: Drizzle Kit for schema migrations and database management
- **TypeScript**: Strict type checking across the entire application stack

### Development Experience
The project is configured for optimal developer experience:

- **Hot Reloading**: Vite middleware integration with Express for seamless development
- **Type Safety**: End-to-end TypeScript with shared schemas between frontend and backend
- **Code Quality**: Consistent formatting and linting setup
- **Path Aliases**: Organized imports with @ aliases for cleaner code structure

## External Dependencies

### Core Framework Dependencies
- **React**: Frontend framework with hooks and modern patterns
- **Express.js**: Web server framework for the backend API
- **TypeScript**: Type safety across the entire application

### Database and ORM
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL support
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **connect-pg-simple**: PostgreSQL session store (configured but not actively used)

### UI and Styling
- **Radix UI**: Headless UI component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth UI interactions
- **Lucide React**: Icon library for consistent iconography

### Form Handling and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Runtime type validation and schema definition
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Data Fetching and State Management
- **TanStack Query**: Server state management and data fetching
- **date-fns**: Date manipulation utilities

### Development and Build Tools
- **Vite**: Fast build tool and development server
- **esbuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind integration
- **TSX**: TypeScript execution for development scripts

### Utility Libraries
- **clsx**: Conditional CSS class composition
- **class-variance-authority**: Type-safe variant API for components
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel/slider component
- **nanoid**: Unique ID generation
- **wouter**: Lightweight router for React

The application is designed to be easily deployable on platforms like Replit, with proper environment variable configuration for database connections and other external services.