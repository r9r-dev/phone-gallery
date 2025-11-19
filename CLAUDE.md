# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 application that displays a personal phone history gallery. The application shows a collection of phones owned over time with metadata including ownership dates, preferences (liked/disliked), and whether they were kept. It features a gallery view and a statistics dashboard.

## Development Commands

All commands should be run from the `src/` directory:

```bash
cd src

# Development
npm run dev          # Start development server on http://localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Docker Commands

Docker configuration is at the repository root:

```bash
# Build and run with docker-compose
docker-compose up -d

# Build image manually
docker build -t phone-gallery .

# Run container
docker run -p 3000:3000 phone-gallery

# Stop containers
docker-compose down
```

## Architecture

### Component Structure

The application follows a single-page architecture with two main views (tabs):

1. **Gallery View**: Grid display of phone cards sorted by most recent first
2. **Statistics View**: Dashboard showing aggregated data and trends

### Key Components

- `src/app/page.tsx` - Entry point that renders PhoneGallery
- `src/components/phone-gallery.tsx` - Main component managing tabs, theme provider, and orchestrating child components
- `src/components/phones.tsx` - Data source: exports the `phones` array with all phone records
- `src/components/phone-statistics.tsx` - Statistics calculations and dashboard UI

### Data Model

The `Phone` type (defined in `phone-gallery.tsx:13-21`):
```typescript
{
  brand: string;
  name: string;
  yearStart: number;
  yearEnd: number | null;  // null indicates currently owned
  kept: boolean;            // still physically own it
  liked: boolean;          // personal preference
  image: string;           // path to image in /public/phones/
}
```

### UI Component Library

Uses shadcn/ui components built on Radix UI:
- Components located in `src/components/ui/`
- Configured via `src/components.json`
- Styling with Tailwind CSS and CSS variables for theming
- Dark mode support via `next-themes` with system preference detection

### Styling System

- Tailwind CSS with custom configuration (`src/tailwind.config.ts`)
- HSL-based color system using CSS variables
- Path alias `@/*` maps to `src/*` (configured in `tsconfig.json:20-22`)
- Dark mode: class-based with ThemeProvider component

### Static Assets

Phone images are stored in `src/public/phones/` and referenced with paths like `/phones/phone-name.jpg` in the data.

## Adding New Phones

To add a new phone to the gallery:

1. Add the phone image to `src/public/phones/`
2. Add a new entry to the `phones` array in `src/components/phones.tsx`
3. Follow the existing data structure with all required fields

The gallery automatically sorts phones by `yearEnd` (or current year if null), then by `yearStart`.
