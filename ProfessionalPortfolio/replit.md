# Portfolio Website - Replit Development Guide

## Overview

This is a full-stack portfolio website for Harvinder Singh, a fresh graduate full-stack developer. The application showcases modern web development practices with a React frontend, Express backend, and PostgreSQL database integration. The site features a professional portfolio layout with sections for about, skills, projects, testimonials, and contact functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure
- **Middleware**: Custom logging and error handling
- **Development**: Hot module replacement with Vite integration

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle migrations with TypeScript schemas
- **Connection**: Neon serverless driver for PostgreSQL connections

## Key Components

### Frontend Components
- **Layout Components**: Navbar, Hero, Footer with responsive design
- **Content Sections**: About, Skills, Projects, Testimonials, Contact
- **UI System**: Complete shadcn/ui component library implementation
- **Theme System**: Light/dark theme support with context provider
- **Animation System**: Scroll-based animations with Intersection Observer

### Backend Services
- **Contact API**: Form submission handling with validation
- **Resume Download**: Static file serving endpoint
- **Storage Layer**: In-memory storage with interface for future database integration
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Shared Resources
- **Schema Definitions**: Shared TypeScript types and Zod schemas
- **Database Models**: Users and contacts tables with proper relationships
- **Type Safety**: Full type safety across frontend and backend

## Data Flow

### Contact Form Submission
1. User fills out contact form in frontend
2. React Hook Form validates data using Zod schema
3. TanStack Query mutation sends POST request to `/api/contact`
4. Backend validates data and stores contact in database
5. Success/error response triggers toast notification
6. Form resets on successful submission

### Content Rendering
1. Static content loads immediately on page render
2. Scroll animations trigger using Intersection Observer
3. Theme changes persist in localStorage
4. Resume download triggers direct file download

### Development Workflow
1. Vite dev server serves frontend with HMR
2. Express server handles API routes and serves static files
3. TypeScript compilation ensures type safety
4. Database schema changes managed through Drizzle migrations

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: react, react-dom, react-hook-form
- **Styling**: tailwindcss, @tailwindcss/typography, autoprefixer
- **UI Components**: @radix-ui/* components, lucide-react icons
- **Backend**: express, @types/express for TypeScript support

### Database and ORM
- **Drizzle ORM**: drizzle-orm, drizzle-kit, drizzle-zod
- **Database Driver**: @neondatabase/serverless
- **Session Storage**: connect-pg-simple for PostgreSQL sessions

### Development Tools
- **Build Tools**: vite, @vitejs/plugin-react, esbuild
- **TypeScript**: tsx for development execution
- **Validation**: zod for runtime type validation
- **Utilities**: clsx, class-variance-authority for styling

### Replit Integration
- **Development**: @replit/vite-plugin-runtime-error-modal
- **Debugging**: @replit/vite-plugin-cartographer for development mode

## Deployment Strategy

### Production Build
1. Frontend builds to `dist/public` directory using Vite
2. Backend bundles to `dist/index.js` using esbuild
3. Static assets served directly by Express in production
4. Environment variables configure database connections

### Development Environment
- Vite dev server with HMR for frontend development
- tsx for TypeScript execution in development
- Database migrations run via `drizzle-kit push`
- Development banner integration for Replit environment

### Database Setup
- PostgreSQL database required (Neon recommended)
- `DATABASE_URL` environment variable must be configured
- Schema migrations handled through Drizzle Kit
- Production and development use same database structure

## Advanced Features Added

### Professional Enhancements
- **Typing Animation**: Dynamic hero section with rotating job titles
- **Skill Progress Bars**: Animated proficiency indicators with shimmer effects
- **Loading Screen**: Professional startup animation with progress tracking
- **Mobile Navigation**: Responsive hamburger menu with smooth animations
- **Stats Counter**: Animated numerical achievements section
- **Enhanced Footer**: Comprehensive contact links and social media integration
- **Interactive Elements**: Hover effects, smooth scrolling, and micro-interactions

### Functional Links
- All social media links are now working and point to actual profiles
- Project demo links connect to live deployment URLs
- Contact information includes clickable email and phone links
- GitHub repository links for each featured project
- Professional email addresses and contact methods

### Visual Improvements
- Custom CSS animations and transitions
- Gradient backgrounds and visual hierarchy
- Professional color scheme with light/dark theme support
- Responsive design optimized for all device sizes
- Enhanced typography and spacing consistency

### Technical Architecture
- TypeScript components with proper type safety
- Scroll-based animations using Intersection Observer
- Form validation with real-time feedback
- Backend contact form processing with error handling
- Modular component structure for maintainability

## Changelog
```
Changelog:
- June 28, 2025. Initial setup
- June 28, 2025. Advanced professional features implementation:
  * Added typing animation for hero section
  * Implemented skill progress bars with animations
  * Created loading screen with progress tracking
  * Enhanced mobile navigation with hamburger menu
  * Added stats counter with animated numbers
  * Improved footer with social links and contact info
  * Made all links functional and professional
  * Enhanced visual design with animations and effects
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
Project goal: Create an advanced, professional portfolio without Tailwind, using custom CSS and JSX forms.
```