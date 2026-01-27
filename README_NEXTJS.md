# TakuraBid – Digital Freight Marketplace  

![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Migrated%20to%20Next.js-blue)

---

## Overview

**TakuraBid** is a digital freight marketplace that connects clients with trusted truck drivers in real time.  
The platform promotes transparent bidding, secure payments, and verified driver profiles — helping reduce empty trips and promote fair, efficient logistics in Zimbabwe's transport sector.

> **MIGRATED TO NEXT.JS**: This project has been successfully migrated from a static HTML/CSS/JavaScript application to a modern Next.js application with TypeScript and Tailwind CSS.

> Developed as part of the **HIT200 Software Engineering Project**

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Nqobileee/Takura-Bid.git
cd Takura-Bid
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) (or the port shown in terminal) to view the application.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
- `npm run type-check` - Run TypeScript type checking

---

## 📱 Application Features

### Driver Portal (`/driver`)
- **Dashboard**: Performance overview with stats and charts
- **Load Board**: Browse and bid on available loads (`/driver/loads`)
- **Job Management**: Track current and completed jobs
- **Real-time Chat**: Communicate with clients

### Client Portal (`/client`)
- **Driver Directory**: Browse and select verified drivers
- **Post Loads**: Create new load postings with detailed requirements (`/client/post-load`)
- **Load Management**: Track active and completed loads
- **Real-time Chat**: Communicate with drivers

### Key Features
- ✅ Responsive design optimized for mobile and desktop
- ✅ Type-safe development with TypeScript
- ✅ Modern UI with Tailwind CSS
- ✅ Component-based architecture
- ✅ Server-side rendering with Next.js
- ✅ Optimized performance and SEO

---

## Tech Stack

| Layer | Technology | Description |
|:------|:------------|:-------------|
| **Frontend** | [Next.js 14](https://nextjs.org/) | React framework with App Router and server-side rendering |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript development |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework for fast, consistent design |
| **UI Components** | React Components | Reusable, type-safe component library |
| **Development** | ESLint + Prettier | Code linting and formatting |
| **Deployment** | Vercel / Netlify *(planned)* | Cloud-based deployment platforms |

---

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   ├── driver/            # Driver portal pages
│   │   ├── page.tsx       # Driver dashboard
│   │   └── loads/         # Load board
│   └── client/            # Client portal pages
│       ├── page.tsx       # Client dashboard  
│       └── post-load/     # Post load form
├── components/            # Reusable React components
│   ├── layout/           # Layout components (Sidebar, etc.)
│   ├── driver/           # Driver-specific components
│   ├── client/           # Client-specific components
│   └── ui/               # Generic UI components
├── lib/                  # Utility functions and helpers
└── styles/              # Global styles and Tailwind config
    └── globals.css      # Global CSS with Tailwind imports
```

---

## Migration Notes

This project was migrated from a static HTML/CSS/JavaScript application to Next.js. Key improvements include:

### ✅ Completed Migrations
- **Static HTML → React Components**: All pages converted to reusable React components
- **CSS → Tailwind CSS**: Migrated to utility-first CSS framework
- **JavaScript → TypeScript**: Added type safety throughout the application
- **Multiple HTML files → Next.js App Router**: Single-page application with client-side routing
- **Manual DOM manipulation → React state management**: Modern state handling

### 🔄 Architecture Improvements
- **Component-based design**: Reusable, maintainable code structure
- **Type safety**: Reduced runtime errors with TypeScript
- **Modern tooling**: ESLint, Prettier, and Next.js dev tools
- **Performance optimization**: Server-side rendering and code splitting
- **SEO optimization**: Better search engine optimization with Next.js

### 📁 Legacy Files (can be removed after verification)
- `index.html`, `client.html`, `home.html` - Replaced by Next.js pages
- `main.js`, `client.js` - Logic migrated to React components
- `style.css`, `client.css` - Styles migrated to Tailwind CSS

---

## 🎯 Objectives

- ✅ Build a digital logistics platform that connects truck drivers with clients  
- ✅ Enable real-time communication between drivers and clients  
- 🔄 Integrate live GPS tracking for truck monitoring *(backend integration needed)*
- ✅ Allow drivers to bid for available loads  
- 🔄 Recommend the most suitable driver for a specific load *(ML algorithm needed)*
- 🔄 Generate reports and analytics on driver performance *(charts integration needed)*

---

## 🚀 Next Steps

1. **Backend Integration**: Connect with Java Spring Boot API
2. **Authentication**: Implement JWT-based authentication
3. **Real-time Features**: Add WebSocket for live chat and notifications
4. **Maps Integration**: Add Google Maps API for location tracking
5. **Database**: Connect to PostgreSQL/MySQL database
6. **Testing**: Add unit and integration tests
7. **Deployment**: Deploy to Vercel or similar platform

---

## Development Guidelines

### Code Style
- Use TypeScript for all new components
- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling (avoid custom CSS when possible)
- Implement responsive design mobile-first

### Component Structure
```typescript
// Example component structure
'use client' // For client components that use hooks/interactivity

interface ComponentProps {
  // Define prop types
}

export function ComponentName({ props }: ComponentProps) {
  // Component logic
  return (
    <div className="tailwind-classes">
      {/* Component JSX */}
    </div>
  )
}
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Contact

- **Project Repository**: [GitHub - TakuraBid](https://github.com/Nqobileee/Takura-Bid)
- **Institution**: Harare Institute of Technology (HIT)
- **Course**: HIT200 Software Engineering Project