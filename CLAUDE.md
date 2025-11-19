# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 application that displays a personal phone history gallery with SQLite database backend. The application shows a collection of phones owned over time with metadata including ownership dates, preferences (liked/disliked), and whether they were kept. It features a gallery view, statistics dashboard, and an admin interface for managing phones.

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

**Frontend:**
- `src/app/page.tsx` - Entry point that renders PhoneGallery
- `src/app/admin/page.tsx` - Admin interface for CRUD operations
- `src/components/phone-gallery.tsx` - Main component managing tabs, theme provider, and orchestrating child components
- `src/components/phone-statistics.tsx` - Statistics calculations and dashboard UI
- `src/components/phones.tsx` - Legacy hardcoded data (used for initial DB migration)

**Backend:**
- `src/lib/db.ts` - SQLite database connection and schema initialization
- `src/lib/migrate-data.ts` - Automatic data migration script
- `src/app/api/phones/route.ts` - API endpoints for listing and creating phones
- `src/app/api/phones/[id]/route.ts` - API endpoints for get/update/delete by ID

### Data Model

The `Phone` type (defined in `src/types/phone.ts`):
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

All phone data is stored in `src/components/phones.tsx` as a typed array.

### UI Component Library

Uses shadcn/ui components built on Radix UI:
- Components located in `src/components/ui/`
- Configured via `src/components.json`
- Styling with Tailwind CSS and CSS variables for theming
- Dark mode support via `next-themes` with system preference detection

### Styling System

- Tailwind CSS with custom configuration (`src/tailwind.config.ts`)
- HSL-based color system using CSS variables
- Path alias `@/*` maps to `src/*` root (configured in `tsconfig.json:20-22`)
- Dark mode: class-based with ThemeProvider component

### Static Assets

Phone images are stored in `src/public/phones/` and referenced with paths like `/phones/phone-name.jpg` in the data.

## Database

### SQLite Database

The application uses SQLite for data persistence:
- Database file: `src/data/phones.db`
- Library: `better-sqlite3`
- Auto-migration: Data from `src/components/phones.tsx` is automatically migrated to DB on first API call

### Database Schema

```sql
CREATE TABLE phones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  year_start INTEGER NOT NULL,
  year_end INTEGER,
  kept BOOLEAN NOT NULL DEFAULT 0,
  liked BOOLEAN NOT NULL DEFAULT 1,
  image TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### API Routes

- `GET /api/phones` - List all phones
- `POST /api/phones` - Create a new phone
- `GET /api/phones/[id]` - Get a specific phone
- `PUT /api/phones/[id]` - Update a phone
- `DELETE /api/phones/[id]` - Delete a phone

## Admin Interface

Access the admin panel at `/admin` to:
- Add new phones to the collection
- Edit existing phone details
- Delete phones from the database
- View all phones in a list format

The admin interface uses the same glassmorphism design as the main gallery.

## Adding New Phones

Two methods to add phones:

### Method 1: Admin Interface (Recommended)
1. Navigate to `/admin`
2. Click "Add New Phone"
3. Fill in the form with phone details
4. Add the phone image to `src/public/phones/` first
5. Reference the image path (e.g., `/phones/phone-name.jpg`)
6. Click "Save"

### Method 2: Direct Database/Code
1. Add the phone image to `src/public/phones/`
2. Add entry to `src/components/phones.tsx` (will be migrated on restart)
3. Or directly insert into the database file

## Docker Volumes

When running with Docker, the SQLite database is persisted in a named volume:
- Volume name: `phone-data`
- Mount point: `/app/data`
- Database path in container: `/app/data/phones.db`

This ensures data persists across container restarts and rebuilds.
