# Support Ticket Management Dashboard

A full-stack support ticket triage and management system built with React, Node.js, Express, Prisma ORM, and PostgreSQL. The application is organized as an npm workspace monorepo sharing validation schemas, enums, and TypeScript interfaces across frontend and backend.

---

## Live Deployments

- **Frontend (Vercel)**: [https://support-ticket-dashboard-kappa.vercel.app](https://support-ticket-dashboard-kappa.vercel.app)
- **Backend API (Render)**: [https://support-ticket-dashboard-7tgp.onrender.com](https://support-ticket-dashboard-7tgp.onrender.com)
- **Database (Neon)**: Neon Serverless PostgreSQL (US East 2)

---

## Table of Contents

- [Overview & Purpose](#overview--purpose)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Local Installation & Setup](#local-installation--setup)
- [Environment Variables](#environment-variables)
- [Database Schema & Migrations](#database-schema--migrations)
- [Deterministic Seed Data](#deterministic-seed-data)
- [API Documentation](#api-documentation)
- [Search, Filter, Sort & Pagination Semantics](#search-filter-sort--pagination-semantics)
- [Validation & Error Handling Contract](#validation--error-handling-contract)
- [Automated Testing Suite (14 Tests)](#automated-testing-suite-14-tests)
- [Command Reference](#command-reference)
- [Production Deployment](#production-deployment)
  - [Backend (Render)](#backend-render)
  - [Frontend (Vercel)](#frontend-vercel)
  - [Database (Neon PostgreSQL)](#database-neon-postgresql)
- [Technical Choices & Rationale](#technical-choices--rationale)
- [Assumptions & Boundaries](#assumptions--boundaries)
- [Non-Functional Considerations](#non-functional-considerations)
  - [Security Considerations](#security-considerations)
  - [Accessibility (a11y)](#accessibility-a11y)
  - [Responsive Layout](#responsive-layout)
- [AI Usage Disclosure](#ai-usage-disclosure)
- [Trade-offs & Constraints](#trade-offs--constraints)
- [Demo & Screenshots](#demo--screenshots)

---

## Overview & Purpose

Support operations teams require a reliable, structured interface to triage incoming issues without losing context or experiencing validation drift. This project provides a full-stack support ticket dashboard that enables support agents to create, view, search, filter, and update customer support tickets.

Key objectives:
1. **Single Source of Truth**: Shared Zod schemas guarantee identical validation rules on client forms and backend endpoints.
2. **Server-Side Operations**: Search, multi-facet filtering, sorting, and pagination are executed server-side via Prisma and PostgreSQL.
3. **Global Metric Accuracy**: Global ticket status counts reflect the complete system dataset independently of active table filters.
4. **Reproducible Monorepo Architecture**: Clean separation between `client`, `server`, and `shared` packages with explicit workspace dependencies for clean deployment builds.

---

## Key Features

- **Global Status Metric Cards**: Real-time aggregate count cards (`Total`, `Open`, `In Progress`, `Resolved`) calculated across the entire dataset. Counts remain stable when table filters are applied.
- **Server-Side Search & Filtering**: Debounced search across ticket titles and customer email addresses, combinable with status and priority filters.
- **Server-Side Sorting & Pagination**: Sort by creation date, update date, title, priority, or status, capped at 10 items per page with next/previous pagination controls.
- **Ticket Creation Modal**: Form modal with client-side Zod validation, error feedback, backdrop/Escape key dismissal, and automatic cache refetching upon successful submission.
- **Ticket Detail & Status Updates**: Modal view displaying full ticket descriptions, timestamps, and interactive controls to update status and/or priority.
- **Centralized Error Handling**: Standardized API error responses mapping validation issues, invalid UUIDs, missing records, and internal server errors.
- **Health Check Endpoint**: Dedicated `/api/health` route for uptime verification and deployment checks.

---

## Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Frontend SPA)                    │
│   React 18 • Vite • TanStack Query v5 • Tailwind CSS        │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON over HTTP
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Render (Backend API)                     │
│   Node.js • Express • TypeScript (Node16 Module Resolution) │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────┐  ┌────────────────────────────┐
│   Shared Contract Package   │  │     Neon (PostgreSQL)      │
│   Zod Schemas • Types       │  │   Prisma ORM • Migrations  │
└─────────────────────────────┘  └────────────────────────────┘
```

### Stack Breakdown

| Layer | Technologies | Role |
|---|---|---|
| **Frontend** | React 18, Vite, TypeScript, TanStack Query v5, React Hook Form, Tailwind CSS, Lucide React | Single-page application, state caching, responsive UI |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, Zod | REST API endpoints, request validation, CORS, error handling |
| **Database** | PostgreSQL (Neon), Prisma ORM | Relational data persistence, schema migrations, indexing |
| **Shared Package** | TypeScript, Zod | Common Zod schemas, TypeScript types, and enums |
| **Testing** | Vitest, Supertest | Unit, schema validation, and live database integration tests |
| **Hosting** | Vercel (Frontend), Render (Backend), Neon (Database) | Production cloud infrastructure |

---

## Repository Structure

```
support-ticket-dashboard/
├── client/                     # Frontend React SPA workspace
│   ├── src/
│   │   ├── api/                # API client with error handling (ticketApi.ts)
│   │   ├── components/         # Ticket tables, modals, metric cards, filters
│   │   │   ├── common/         # Badge and layout UI primitives
│   │   │   └── tickets/        # CreateModal, DetailModal, Filters, List, Pagination, SummaryCards
│   │   ├── hooks/              # Custom React hooks (useDebounce.ts)
│   │   ├── types/              # Frontend view interfaces (ticket.ts)
│   │   ├── App.tsx             # Main dashboard page component
│   │   ├── main.tsx            # React DOM bootstrap & QueryClient setup
│   │   └── index.css           # Tailwind CSS styles
│   ├── .env.example            # Client environment variable template
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── vercel.json             # Vercel SPA route rewrite rules
│   └── vite.config.ts          # Vite build configuration
├── server/                     # Backend REST API workspace
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma schema & index definitions
│   │   ├── migrations/         # Committed database migration SQL files
│   │   └── seed.ts             # 28-ticket deterministic seed generator
│   ├── src/
│   │   ├── config/             # Environment configuration (env.ts)
│   │   ├── controllers/        # Request handlers (ticket.controller.ts)
│   │   ├── middleware/         # Validation middleware & error handler (errorHandler.ts)
│   │   ├── routes/             # REST endpoint routing (ticket.routes.ts)
│   │   ├── services/           # Prisma data access queries (ticket.service.ts)
│   │   ├── utils/              # ApiError class & asyncHandler
│   │   ├── app.ts              # Express application setup & CORS configuration
│   │   ├── prisma.ts           # Shared PrismaClient instance
│   │   └── server.ts           # HTTP server listener & port binding
│   ├── tests/                  # Automated integration test suite
│   │   ├── health.test.ts      # Health endpoint test
│   │   ├── tickets.test.ts     # Schema validation & query parameter tests
│   │   └── db_tickets.test.ts  # Live PostgreSQL integration tests
│   ├── .env.example            # Server environment variable template
│   └── tsconfig.json           # Server TypeScript configuration
├── shared/                     # Shared workspace package
│   ├── src/
│   │   └── index.ts            # Enums, Zod schemas, and TypeScript interfaces
│   ├── package.json            # Shared package manifest
│   └── tsconfig.json           # Shared TypeScript configuration
├── package.json                # Monorepo workspace configuration & root scripts
├── package-lock.json           # Locked dependency tree
└── README.md                   # Project documentation
```

---

## Prerequisites

- **Node.js**: `v18.18.0` or higher (tested with Node 20 LTS)
- **npm**: `v9.0.0` or higher
- **PostgreSQL**: Accessible PostgreSQL instance (Neon cloud database or local PostgreSQL 14+)

---

## Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gtathelegend/support-ticket-dashboard.git
   cd support-ticket-dashboard
   ```

2. **Install all workspace dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the project root or `server/.env`, and create `client/.env`:

   ```bash
   # Server environment (.env or server/.env)
   DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
   PORT=4000
   CLIENT_URL="http://localhost:5173"
   NODE_ENV="development"

   # Client environment (client/.env)
   VITE_API_URL="http://localhost:4000"
   ```

4. **Build the shared package and generate Prisma Client**:
   ```bash
   npm run build --workspace=shared
   npm run db:generate
   ```

5. **Run database migrations & seed deterministic data**:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

6. **Start local development servers**:
   In two separate terminal sessions:
   ```bash
   # Terminal 1: Backend API (http://localhost:4000)
   npm run dev

   # Terminal 2: Frontend Client (http://localhost:5173)
   npm run dev:client
   ```

---

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | Localhost PostgreSQL string | PostgreSQL connection URL with SSL mode support |
| `PORT` | No | `4000` | HTTP port the Express server binds to (Render sets this dynamically) |
| `CLIENT_URL` | No | `http://localhost:5173` | Allowed CORS origins (comma-separated list for multiple origins) |
| `NODE_ENV` | No | `development` | Application runtime environment (`development`, `production`, `test`) |

### Client (`client/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | Yes | `http://localhost:4000` | Base URL of the backend API without trailing slash |

---

## Database Schema & Migrations

The database layer uses Prisma ORM with PostgreSQL.

### Actual Schema (`server/prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

enum Status {
  OPEN
  IN_PROGRESS
  RESOLVED
}

model Ticket {
  id            String   @id @default(uuid())
  title         String   @db.VarChar(120)
  description   String   @db.Text
  customerEmail String   @map("customer_email")
  priority      Priority
  status        Status   @default(OPEN)
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  @@index([status])
  @@index([priority])
  @@index([createdAt])
  @@map("tickets")
}
```

### Migration Commands

- **Apply migrations locally (Development)**:
  ```bash
  npm run db:migrate
  ```
- **Apply migrations in Production / CI (Non-interactive)**:
  ```bash
  npx prisma migrate deploy --schema=server/prisma/schema.prisma
  ```

---

## Deterministic Seed Data

The project contains a deterministic seed file (`server/prisma/seed.ts`) populating **28 realistic support tickets** across 10 operational categories:
1. Billing & Invoicing (duplicate charge refund, missing VAT ID on invoice)
2. Account Access & 2FA (locked admin account, workspace invitation permissions)
3. Login & SAML SSO (Okta SAML redirection loop, password reset email delivery)
4. Technical & Performance (CSV export timeout, search endpoint latency)
5. Payment Failures (declined card renewal, SEPA Direct Debit IBAN verification)
6. Subscription & Seat Management (license count downgrade, prorated credit balance)
7. Feature Requests (webhook triggers on priority update, dark mode theme)
8. Notification Delivery (expired Slack webhook token, duplicate email notifications)
9. API & Partner Integrations (bearer token 401 rejection, Zendesk field mapping)
10. Dashboard & UI Edge Cases (pagination filter state, mobile layout viewport)

### Dataset Distribution
- **Total Tickets**: 28
- **Status Distribution**: `OPEN`: 12 | `IN_PROGRESS`: 9 | `RESOLVED`: 7
- **Priority Distribution**: `LOW`: 8 | `MEDIUM`: 12 | `HIGH`: 8

### Execution
```bash
npm run db:seed
```
> **Note**: Production startup executes `prisma migrate deploy` to ensure schema synchronization, but does **not** automatically seed demo data. Seeding is an explicit, manual command.

---

## API Documentation

Base Path: `/api`

### 1. Health Check
`GET /api/health`

Returns service health status.

- **Status**: `200 OK`
- **Response Body**:
  ```json
  {
    "success": true,
    "data": {
      "status": "ok"
    }
  }
  ```

---

### 2. List Tickets
`GET /api/tickets`

Returns a paginated list of tickets matching optional filter and search criteria.

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `search` | String | No | - | Case-insensitive search across `title` and `customerEmail` (server-side) |
| `status` | Enum | No | - | Filter by status (`OPEN`, `IN_PROGRESS`, `RESOLVED`) |
| `priority` | Enum | No | - | Filter by priority (`LOW`, `MEDIUM`, `HIGH`) |
| `sortBy` | Enum | No | `createdAt` | Sort field (`createdAt`, `updatedAt`, `title`, `priority`, `status`) |
| `sortOrder` | Enum | No | `desc` | Sort direction (`asc`, `desc`) |
| `page` | Integer | No | `1` | Page number (integer $\ge 1$) |
| `limit` | Integer | No | `10` | Items per page (max `10`) |

- **Status**: `200 OK`
- **Response Body**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "00000000-0000-4000-a000-000000000001",
          "title": "Duplicate charge on monthly subscription invoice",
          "description": "Customer was billed twice for invoice #INV-2026-0901 on September 15...",
          "customerEmail": "alex.morgan@techcorp.io",
          "priority": "HIGH",
          "status": "OPEN",
          "createdAt": "2026-09-04T12:00:00.000Z",
          "updatedAt": "2026-09-04T12:00:00.000Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalItems": 28,
        "totalPages": 3,
        "hasNextPage": true,
        "hasPreviousPage": false
      }
    }
  }
  ```

---

### 3. Summary Metrics
`GET /api/tickets/summary`

Returns global status counts calculated over the entire dataset, independent of active query filters.

- **Status**: `200 OK`
- **Response Body**:
  ```json
  {
    "success": true,
    "data": {
      "total": 28,
      "open": 12,
      "inProgress": 9,
      "resolved": 7
    }
  }
  ```

---

### 4. Get Ticket By ID
`GET /api/tickets/:id`

Retrieves a single ticket by UUID.

- **Path Parameter**: `id` (UUID format required)
- **Status**: `200 OK`
- **Response Body**:
  ```json
  {
    "success": true,
    "data": {
      "id": "00000000-0000-4000-a000-000000000001",
      "title": "Duplicate charge on monthly subscription invoice",
      "description": "Customer was billed twice for invoice #INV-2026-0901...",
      "customerEmail": "alex.morgan@techcorp.io",
      "priority": "HIGH",
      "status": "OPEN",
      "createdAt": "2026-09-04T12:00:00.000Z",
      "updatedAt": "2026-09-04T12:00:00.000Z"
    }
  }
  ```

---

### 5. Create Ticket
`POST /api/tickets`

Creates a new ticket record.

#### Request Body
```json
{
  "title": "Cannot export compliance reports",
  "description": "Export modal reports 500 error when date range exceeds 30 days.",
  "customerEmail": "compliance@customer.org",
  "priority": "HIGH",
  "status": "OPEN"
}
```

- **Status**: `201 Created`
- **Response Body**: Returns the created ticket record.

---

### 6. Update Ticket
`PATCH /api/tickets/:id`

Updates ticket status and/or priority. At least one field must be provided.

#### Request Body
```json
{
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}
```

- **Status**: `200 OK`
- **Response Body**: Returns the updated ticket record with refreshed `updatedAt`.

---

## Search, Filter, Sort & Pagination Semantics

- **Server-Side Search**: Case-insensitive substring search matching against `title` OR `customerEmail` performed server-side via Prisma.
- **Combined Filtering**: Search criteria, `status`, and `priority` filters combine using logical `AND`.
- **Global Metric Isolation**: The `/api/tickets/summary` endpoint counts records from the whole database table. Card metrics do not fluctuate when table filters are applied.
- **Strict Pagination Constraints**: Page size is hard-capped at 10 items. Requests with negative `page` or `limit > 10` return HTTP `400 Bad Request`.
- **Cache Invalidation**: When a ticket is created or updated, mutations execute against the API, and relevant TanStack Query caches are invalidated and refetched automatically.

---

## Validation & Error Handling Contract

All validation schemas are shared between frontend and backend via `@support-ticket-dashboard/shared`.

### Validation Rules

| Field | Type | Rules |
|---|---|---|
| `title` | String | Required, trimmed, 1–120 characters |
| `description` | String | Required, trimmed, minimum 1 character |
| `customerEmail` | String | Required, valid email format validated using the shared Zod schema |
| `priority` | Enum | Required: `LOW`, `MEDIUM`, `HIGH` |
| `status` | Enum | Optional on create (defaults to `OPEN`): `OPEN`, `IN_PROGRESS`, `RESOLVED` |
| `PATCH /:id` | Object | Requires at least one field (`status` or `priority`) |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload or parameters",
    "details": [
      {
        "field": "customerEmail",
        "message": "Invalid email address format"
      }
    ]
  }
}
```

### HTTP Status Code Mappings

| Status Code | Error Code | Scenario |
|---|---|---|
| `400 Bad Request` | `VALIDATION_ERROR` | Request body or query parameters failed Zod validation |
| `400 Bad Request` | `INVALID_ID` | Path parameter `:id` is not a valid UUID |
| `404 Not Found` | `NOT_FOUND` | Ticket with requested UUID does not exist |
| `500 Internal Error`| `INTERNAL_SERVER_ERROR`| Uncaught database or server execution error |

---

## Automated Testing Suite (14 Tests)

The backend test suite is built with **Vitest** and **Supertest**. When a PostgreSQL database is reachable at `DATABASE_URL`, live database integration tests execute against the configured database.

```bash
npm run test
```

### Verified Test Cases (14/14 Passing)

```
 ✓ tests/health.test.ts (1 test)
   ✓ GET /api/health -> 200 OK with status: 'ok'

 ✓ tests/tickets.test.ts (9 validation & contract tests)
   ✓ POST /api/tickets -> 400 Bad Request when title > 120 chars and email is invalid
   ✓ POST /api/tickets -> 400 Bad Request when title or description is only whitespace
   ✓ POST /api/tickets -> 400 Bad Request when priority is invalid enum
   ✓ GET /api/tickets -> 400 Bad Request when page is negative or invalid string
   ✓ GET /api/tickets -> 400 Bad Request when limit exceeds 10
   ✓ GET /api/tickets -> 400 Bad Request when status enum parameter is invalid
   ✓ PATCH /api/tickets/:id -> 400 Bad Request with INVALID_ID when ID is malformed
   ✓ PATCH /api/tickets/:id -> 400 Bad Request when update payload is empty {}
   ✓ GET /api/tickets/:id -> 400 Bad Request with INVALID_ID when path ID is not a UUID

 ✓ tests/db_tickets.test.ts (4 live PostgreSQL integration tests)
   ✓ POST /api/tickets -> Verifies real database creation & field persistence in PostgreSQL
   ✓ GET /api/tickets -> Verifies multi-parameter filtering & pagination metadata against PostgreSQL
   ✓ PATCH /api/tickets/:id -> Verifies atomic status/priority updates and updatedAt timestamp advance
   ✓ GET /api/tickets/summary -> Verifies global unfiltered metrics against live database
```

---

## Command Reference

| Command | Workspace | Description |
|---|---|---|
| `npm run dev` | Server | Starts backend server in watch mode on port 4000 via `tsx` |
| `npm run dev:client` | Client | Starts frontend development server on port 5173 via Vite |
| `npm run build` | All | Builds `shared`, generates Prisma Client, and builds `server` & `client` |
| `npm run typecheck` | All | Runs `tsc --noEmit` across `shared`, `server`, and `client` |
| `npm run test` | Server | Runs the 14-test Vitest integration test suite |
| `npm run db:generate` | Server | Generates Prisma Client from schema |
| `npm run db:migrate` | Server | Runs Prisma migrations in development mode |
| `npm run db:seed` | Server | Seeds the database with 28 deterministic ticket records |

---

## Production Deployment

### Backend (Render)

- **Service Type**: Web Service
- **Root Directory**: `.` (monorepo root)
- **Environment**: Node
- **Build Command**:
  ```bash
  npm ci && npm run build --workspace=shared && npm run build --workspace=server
  ```
- **Start Command**:
  ```bash
  npx prisma migrate deploy --schema=server/prisma/schema.prisma && npm run start --workspace=server
  ```
- **Environment Variables**:
  - `DATABASE_URL`: Neon PostgreSQL pooled connection string (`postgresql://...sslmode=require`)
  - `CLIENT_URL`: Deployed Vercel frontend URL (`https://support-ticket-dashboard-kappa.vercel.app`)
  - `NODE_ENV`: `production`

---

### Frontend (Vercel)

- **Framework Preset**: Vite
- **Root Directory**: `.` (monorepo root)
- **Build Command**:
  ```bash
  npm run build --workspace=client
  ```
- **Output Directory**: `client/dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://support-ticket-dashboard-7tgp.onrender.com`
- **SPA Rewrites**: Configured in `client/vercel.json` to route client-side paths to `/index.html`.

---

### Database (Neon PostgreSQL)

- **Provider**: Neon Serverless PostgreSQL
- **Connection**: Pooled connection string with SSL mode required.
- **Migrations**: Executed automatically during Render startup via `prisma migrate deploy`.

---

## Technical Choices & Rationale

- **Monorepo with Shared Contract**: Placing schemas in `shared/` ensures that validation logic and type definitions are defined once and consumed by both Express routes and React Hook Form.
- **Node16 TypeScript Module Resolution**: Configured across workspaces to support TypeScript compilation in modern CI/CD pipelines without deprecated module resolution flags.
- **Explicit Server Type Dependencies**: Build-time dependencies (`@types/node`, `@types/express`, `@types/cors`, `prisma`, `typescript`) are explicitly declared in `server/package.json` to guarantee isolated clean builds (`npm ci`) in production environments.
- **TanStack Query Caching**: Manages server state caching, background refetching, and automatic cache invalidation upon mutations.

---

## Assumptions & Boundaries

- **Single-Tenant Dashboard**: Implemented as a single-organization support dashboard without multi-tenant workspace separation.
- **Authentication**: User authentication, sessions, and role-based permissions are out of scope.
- **File Attachments**: Ticket descriptions support text only; binary file attachments are out of scope.
- **Realtime Push**: Uses cache invalidation on mutations rather than persistent WebSocket connections.

---

## Non-Functional Considerations

### Security Considerations
- **SQL Injection Prevention**: Queries are executed via Prisma ORM parameterized statements.
- **CORS Configuration**: Allowed origins are validated against the configured `CLIENT_URL` environment variable.
- **Input Validation**: Request data is validated and normalized/trimmed according to the shared schemas.
- **Secret Hygiene**: Database connection strings and environment files are excluded from git via `.gitignore`.

### Accessibility (a11y)
- Semantic HTML elements (`<main>`, `<header>`, `<section>`, `<table>`, `<button>`).
- Form controls include associated `<label>` elements.
- Interactive buttons and inputs include `:focus-visible` outline styles.
- Modal dialogs include `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` attributes.
- Modals support dismissal via the Escape key and backdrop clicks.

### Responsive Layout
- Responsive layout built using Tailwind CSS utility classes.
- Grid metrics adapt from 1 column on small screens to 4 columns on desktop viewports.
- Horizontal scrolling enabled for data tables on smaller viewports.

---

## AI Usage Disclosure

AI tooling was utilized during development for scaffolding, test writing, and TypeScript configuration troubleshooting. All generated code was reviewed, debugged, modified, and verified against a live Neon PostgreSQL database and the complete automated test suite. The implementation can be fully explained and defended by the author.

---

## Trade-offs & Constraints

- **ORM Abstraction**: Prisma ORM was chosen for developer velocity and schema type safety over raw SQL queries, with database-level indexes added on `status`, `priority`, and `createdAt` for query performance.
- **Fixed Pagination Limit**: A strict limit of 10 items per page was implemented to ensure bounded response payloads and consistent rendering latency.

---

## Demo & Screenshots

> Screenshots / demo recordings can be added before submission.
