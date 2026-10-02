# Support Ticket Dashboard

A full-stack web application for managing support tickets built with React 18, Node.js, Express, Prisma ORM, PostgreSQL, and TypeScript.

## Repository Structure

```
support-ticket-dashboard/
├── client/          # Frontend SPA built with React 18, Vite, TanStack Query, React Hook Form & Tailwind CSS
├── server/          # Backend REST API built with Node.js, Express, Prisma ORM & Vitest
├── shared/          # Shared Zod validation schemas, TypeScript types, and Enums
├── .gitignore       # Git ignore rules for node_modules, build artifacts, and env files
└── README.md        # Technical setup and documentation
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Zod
- **Testing**: Vitest, Supertest
- **Shared Validation**: Zod schemas enforcing dual-layer validation across frontend & backend

## Environment Setup

Copy `.env.example` templates to `.env`:

### Server (`server/.env.example`)
```bash
# Database Connection String (PostgreSQL / Neon)
DATABASE_URL="postgresql://user:password@ep-host.neon.tech/neondb?sslmode=require"

# Server Port
PORT=4000

# Client Web Application URL (CORS)
CLIENT_URL="http://localhost:5173"
```

### Client (`client/.env.example`)
```bash
# Production URL of deployed Render backend service
VITE_API_URL="http://localhost:4000"
```

## Available Scripts

### Monorepo Root Scripts
- `npm run build`: Compiles shared package, backend server, and frontend client.
- `npm run typecheck`: Runs TypeScript typechecks across all 3 packages (`shared`, `server`, `client`).
- `npm run test`: Runs Vitest integration tests in backend.
- `npm run dev`: Launches backend development server on port 4000.
- `npm run dev:client`: Launches Vite frontend development server on port 5173.
- `npm run db:generate`: Generates Prisma Client artifacts.
- `npm run db:migrate`: Executes Prisma database migrations.
- `npm run db:seed`: Seeds database with 28 deterministic support tickets.

## Database Schema & Seed Data

The database uses PostgreSQL with Prisma ORM.

### Enums
- **Priority**: `LOW`, `MEDIUM`, `HIGH`
- **Status**: `OPEN`, `IN_PROGRESS`, `RESOLVED`

### Seed Data Statistics
The seed generator populates **28 realistic support tickets** across 10 distinct operational categories:
- **Status Distribution**: `OPEN`: 12 | `IN_PROGRESS`: 9 | `RESOLVED`: 7
- **Priority Distribution**: `LOW`: 8 | `MEDIUM`: 12 | `HIGH`: 8

## Production Deployment Guide

### 1. Database (Neon PostgreSQL)
- **Provider**: Neon PostgreSQL
- **Migration Command**:
  ```bash
  npx prisma migrate deploy
  ```
- **Seed Command** (manual initialization):
  ```bash
  npm run db:seed --workspace=server
  ```
  *Note: Seed script should be executed once for demo data, not automatically on every server restart.*

### 2. Backend (Render Web Service)
- **Provider**: Render
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Environment Variables**:
  - `DATABASE_URL`: Neon PostgreSQL connection string.
  - `PORT`: Automatically assigned by Render (falls back to 4000).
  - `CLIENT_URL`: URL of deployed Vercel frontend (e.g. `https://support-ticket-dashboard.vercel.app`).
  - `NODE_ENV`: `production`

### 3. Frontend (Vercel SPA)
- **Provider**: Vercel
- **Build Command**: `npm run build`
- **Output Directory**: `client/dist`
- **Environment Variables**:
  - `VITE_API_URL`: Deployed Render backend URL (e.g. `https://support-ticket-api.onrender.com`).
- **SPA Routing**: Handled via `client/vercel.json` rewrite rule to redirect client routes to `/index.html`.
