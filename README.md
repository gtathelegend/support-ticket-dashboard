# Support Ticket Dashboard

A full-stack web application for managing support tickets built with React, Node.js, Express, Prisma, PostgreSQL, and TypeScript.

## Repository Structure

```
support-ticket-dashboard/
├── client/          # Frontend SPA built with React, Vite, TanStack Query, React Hook Form & Tailwind CSS
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

Copy `.env.example` in `server/` to `server/.env` and update configuration variables:

```bash
# Database Connection String (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/support_ticket_db?schema=public"

# Server Port
PORT=4000

# Client Web Application URL (CORS)
CLIENT_URL="http://localhost:5173"
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
- `npm run db:seed`: Seeds PostgreSQL database with 28 deterministic support tickets.

## Database Schema & Seed Data

The database uses PostgreSQL with Prisma ORM.

### Enums
- **Priority**: `LOW`, `MEDIUM`, `HIGH`
- **Status**: `OPEN`, `IN_PROGRESS`, `RESOLVED`

### Seed Data Statistics
The seed generator populates **28 realistic support tickets** across 10 distinct operational categories:
- **Status Distribution**:
  - `OPEN`: 12 tickets
  - `IN_PROGRESS`: 9 tickets
  - `RESOLVED`: 7 tickets
- **Priority Distribution**:
  - `LOW`: 8 tickets
  - `MEDIUM`: 12 tickets
  - `HIGH`: 8 tickets
