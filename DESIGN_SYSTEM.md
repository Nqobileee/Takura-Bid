# TakuraBid Design System

This document outlines the design system, typography, color palettes, and styling guidelines used throughout the TakuraBid platform.

## Table of Contents
1. [Typography](#typography)
2. [Color Palette](#color-palette)
3. [Component Styling](#component-styling)
4. [Layout System](#layout-system)
5. [Form Elements](#form-elements)
6. [Interactive Elements](#interactive-elements)
7. [Utility Classes](#utility-classes)

## Typography

### Font Family
**Primary Font:** Open Sans (Google Fonts)
```css
font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Font Weights Available:**
- Light (300)
- Regular (400)
- Medium (500)
- Semi-bold (600)
- Bold (700)
- Extra Bold (800)

### Heading Hierarchy

| Element | Size | Line Height | Weight | Usage |
|---------|------|-------------|---------|-------|
| `h1` | 24px | 1.3 | 600 | Page titles |
| `h2` | 20px | 1.3 | 600 | Section headings |
| `h3` | 18px | 1.4 | 600 | Subsection headings |
| `h4` | 16px | 1.4 | 600 | Card titles |
| `h5` | 15px | 1.4 | 600 | Small headings |
| `h6` | 14px | 1.4 | 600 | Micro headings |

### Body Text
- **Default:** 16px, line-height 1.5, weight 400
- **Letter spacing:** -0.01em
- **Small text/Captions:** 14px, line-height 1.5

### Specialized Typography Classes
```css
.page-title {
  font-size: 24px;
  line-height: 1.3;
  font-weight: 600;
  color: #111827;
}

.page-subtitle {
  font-size: 16px;
  line-height: 1.5;
  color: #6b7280;
}

.brand-logo {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.05em;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
}
```

## Color Palette

### Primary Colors
```css
--primary-accent: #000000      /* Pure black for text and UI elements */
--secondary-accent: #1a1a1a    /* Dark gray for secondary elements */
```

### Semantic Colors
```css
--success-color: #10b981       /* Green for success states */
--warning-color: #f59e0b       /* Amber for warnings */
--error-color: #ef4444         /* Red for errors */
```

### Background Colors
```css
--main-bg: #ffffff            /* Main background */
--card-bg: #ffffff            /* Card backgrounds */
--hover-bg: #f9fafb          /* Hover state background */
```

### Text Colors
```css
--text-primary: #111827       /* Primary text color */
--text-secondary: #6b7280     /* Secondary text color */
--text-muted: #9ca3af         /* Muted text color */
```

### Border Colors
```css
--border-color: #e5e7eb       /* Default border color */
--border-light: #f3f4f6       /* Light border color */
```

### Accent Colors Used in Components

#### Purple (Brand Accent)
- `purple-600` (#3f2a52) - Primary purple for buttons and accents
- `purple-700` (#7c3aed) - Hover state for purple elements

#### Blue (Information)
- `blue-600` (#2563eb) - Information elements, links
- `blue-50` (#eff6ff) - Light blue backgrounds

#### Green (Success)
- `green-600` (#16a34a) - Success states, available status
- `green-700` (#15803d) - Hover states for green elements

#### Gray Scale (Tailwind CSS)
- `gray-50` to `gray-900` - Used throughout for neutral elements
- `gray-900` (#111827) - Primary dark color
- `gray-600` (#4b5563) - Medium gray for secondary text
- `gray-300` (#d1d5db) - Light gray for borders
- `gray-100` (#f3f4f6) - Very light gray for backgrounds

### Shadow System
```css
--glow-effect: 0 0 25px rgba(0, 0, 0, 0.05);
--glow-effect-strong: 0 0 40px rgba(0, 0, 0, 0.1);
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

## Component Styling

### Cards
```css
.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: var(--glow-effect);
}

.card-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.card-content {
  padding: 24px;
}

.card-title {
  font-size: 20px;
  line-height: 1.2;
  font-weight: 600;
  color: #111827;
}
```

### Statistics Cards
```css
.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 24px;
  text-align: center;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.stat-value {
  font-size: 30px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}
```

## Layout System

### Container Classes
```css
.app-container {
  min-height: 100vh;
  background: white;
}

.main-content {
  padding-top: 64px;
  padding-left: 24px;
  padding-right: 24px;
  max-width: 1280px;
  margin: 0 auto;
}

.content-area {
  flex: 1;
  overflow: auto;
  padding: 24px;
  gap: 24px;
}
```

### Page Structure
```css
.page-header {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Navigation
```css
.floating-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  padding: 8px;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #111827;
}

.nav-link.active {
  color: #111827;
}
```

## Form Elements

### Input Fields
```css
.input-field {
  display: block;
  width: 100%;
  padding: 12px 16px;
  color: #111827;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  ring: 2px;
  ring-color: #111827;
  border-color: transparent;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}
```

## Interactive Elements

### Button System

#### Primary Button
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: #111827;
  border: 1px solid transparent;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #1f2937;
}
```

#### Secondary Button
```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}
```

#### Ghost Button
```css
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.btn-ghost:hover {
  background-color: #f9fafb;
}
```

#### Purple Accent Buttons (Used for driver cards)
```css
/* Message and Invite buttons */
background-color: #3f2a52; /* purple-600 */
color: white;

/* Hover state */
background-color: #7c3aed; /* purple-700 */
```

### List Items
```css
.list-item {
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
}

.list-item:hover {
  background-color: #f9fafb;
}

.list-item:last-child {
  border-bottom: none;
}
```

### Status Badges
```css
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
}
```

## Utility Classes

### Spacing
- Follows Tailwind CSS spacing scale (0.25rem increments)
- Common spacing: 4px, 8px, 12px, 16px, 20px, 24px, 32px

### Border Radius
- Small: 4px
- Default: 6px
- Medium: 8px
- Large: 16px
- Full: 50%

### Transitions
- Duration: 200ms (0.2s)
- Easing: ease-in-out
- Properties: colors, background-color, transform, opacity

### Special Effects
```css
.glow {
  box-shadow: var(--glow-effect-strong);
}

.shadow-professional {
  box-shadow: var(--shadow-md);
}
```

## Responsive Breakpoints

Following Tailwind CSS breakpoints:
- `sm`: 640px
- `md`: 768px  
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Brand Guidelines

### Logo
- Font: Open Sans Extra Bold (800)
- Letter spacing: -0.05em
- Gradient: Linear gradient from #1f2937 to #374151

### Primary Brand Colors
- **Black (#000000)**: Primary brand color for text and UI elements
- **Purple (#3f2a52)**: Secondary brand color for accents and CTAs
- **White (#ffffff)**: Background and contrast color

### Design Principles
1. **Clean and Minimal**: Focus on content with minimal visual noise
2. **Professional**: Business-oriented color scheme with high contrast
3. **Accessible**: High contrast ratios and readable typography
4. **Consistent**: Uniform spacing, typography, and component styling
5. **Responsive**: Mobile-first approach with smooth scaling

## Implementation Notes

1. All custom properties are defined in `:root` for easy theming
2. Tailwind CSS is used for utility classes and responsive design
3. Custom component classes are defined in the `@layer components` section
4. Font loading uses `display=swap` for better performance
5. All transitions use consistent timing (200ms) for smooth interactions