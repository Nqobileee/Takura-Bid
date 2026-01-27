# Takura-Bid Project Structure

A modern load and driver management platform built with Next.js, React, TypeScript, and TailwindCSS.

## Tech Stack
- **Framework**: Next.js 16.1.4 with App Router
- **Frontend**: React 19.2.3 with TypeScript 5.9.3
- **Styling**: TailwindCSS 3.4.19
- **Build Tool**: Turbopack
- **Font**: Inter (Professional Typography)
- **Design System**: Modern platform design inspired by Fiverr, Upwork, Uber, Airbnb

## Project Structure

### Root Files
```
next-env.d.ts          # Next.js TypeScript declaration file
next.config.js         # Next.js configuration (ES modules, experimental features)
package.json           # Project dependencies and scripts (ES module format)
postcss.config.js      # PostCSS configuration for TailwindCSS
README.md             # Main project documentation  
README_NEXTJS.md      # Next.js specific documentation
tailwind.config.js    # TailwindCSS configuration (v3.4.19 for compatibility)
tsconfig.json         # TypeScript compiler configuration
```

### Public Directory (`public/`)
Static assets served directly by Next.js:
- Images, icons, fonts
- Favicon files
- Static resources accessible at root URL

### Source Code (`src/`)

#### Application Pages (`src/app/`)
Next.js App Router file-based routing structure:

**Main Layout & Home**
- `layout.tsx` - Root layout with metadata, fonts, and providers
- `page.tsx` - Homepage/landing page component

**Client Interface (`client/`)**
- `page.tsx` - Client dashboard with driver selection and analytics
- `post-load/page.tsx` - Load posting form with comprehensive details
- `chat/page.tsx` - Real-time messaging interface with drivers

**Driver Interface (`driver/`)**
- `page.tsx` - Driver dashboard with performance metrics
- `loads/page.tsx` - Load board with list view and bidding functionality
- `jobs/page.tsx` - Active jobs and job history management
- `chat/page.tsx` - Communication interface with clients

#### React Components (`src/components/`)

**Client Components (`client/`)**
- `DriversList.tsx` - Display and filter available drivers

**Driver Components (`driver/`)**
- `DriverStats.tsx` - Dashboard metrics and performance indicators

**Layout Components (`layout/`)**
- `DashboardLayout.tsx` - Main dashboard wrapper using FloatingNavbar
- `FloatingNavbar.tsx` - Modern translucent navigation with backdrop blur
- `Sidebar.tsx` - Legacy sidebar component (replaced by FloatingNavbar)

**UI Components (`ui/`)**
Reusable UI components and design system elements

#### Utility Functions (`src/lib/`)
- `utils.ts` - Shared utility functions and helpers

#### Global Styles (`src/styles/`)
- `globals.css` - 
  - Inter font imports and configuration
  - CSS custom properties for consistent theming
  - Professional color scheme (white background, gray accents)
  - Component utility classes (cards, buttons, forms, stats)
  - Backdrop blur and shadow effects
  - Minimal corner rounding (4px maximum)

## Design System

### Typography
- **Primary Font**: Inter (formal, professional)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Headers**: Bold weights with proper spacing
- **Body Text**: Regular weight with optimal line height

### Color Scheme
- **Background**: Pure white (#ffffff)
- **Text**: Grayscale hierarchy (gray-900 to gray-500)
- **Accents**: Black for primary actions, subtle grays for secondary
- **Status Colors**: Green (success), Red (urgent), Blue (info), Yellow (pending)

### Component Classes
- **Cards**: `.card` - White background with subtle shadows and minimal rounding
- **Buttons**: `.btn-primary`, `.btn-secondary`, `.btn-ghost` - Consistent styling
- **Forms**: `.input-field` - Professional input styling with focus states  
- **Stats**: `.stats-grid`, `.stat-card` - Dashboard metric displays
- **Lists**: `.list-item` - Consistent list item styling
- **Headers**: `.page-header`, `.page-title`, `.page-subtitle` - Page structure

### Navigation
- **FloatingNavbar**: Translucent backdrop with blur effect
- **Responsive**: Mobile-friendly with hamburger menu
- **Clean**: No icons unless absolutely necessary (black/white only)

## Key Features

### For Clients
1. **Dashboard**: Overview of active loads and driver selection
2. **Post Load**: Comprehensive form for load details and requirements  
3. **Chat**: Real-time communication with drivers
4. **Analytics**: Load statistics and spending metrics

### For Drivers  
1. **Load Board**: Browse and bid on available loads (list view)
2. **Jobs Management**: Track active jobs and history
3. **Chat**: Communicate with clients about jobs
4. **Dashboard**: Performance metrics and earnings

### Shared Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live chat and status updates
- **Professional UI**: Modern platform aesthetic
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized with Next.js and Turbopack

## Development Guidelines

### Code Style
- Use TypeScript for all components
- Follow React hooks patterns
- Implement proper error boundaries
- Use semantic HTML elements
- Maintain accessibility standards

### Design Principles
- Clean, minimal interface design
- Professional typography and spacing
- Consistent component patterns
- Mobile-first responsive design
- Fast loading and smooth animations

### Component Structure
- Server components for static content
- Client components for interactive features  
- Proper separation of concerns
- Reusable component library
- Consistent prop interfaces

## Deployment
- **Platform**: Vercel (optimized for Next.js)
- **Build**: Automatic deployment on git push
- **Environment**: Production-ready with edge functions
- **Performance**: CDN distribution and image optimization