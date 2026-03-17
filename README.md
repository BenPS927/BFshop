# BF Shop

BF Shop is a full business system built as a modern full-stack web application.

It includes:
- A customer ecommerce frontend
- A merchant operations frontend
- A shared backend and database layer
- AI enhancements for both customer and merchant workflows
- AI Overwatch as a centralized control and visibility layer
- Workflow automation touchpoints with n8n where useful

## Project Vision
Build an end-to-end commerce operations platform where manual and AI-assisted actions both follow the same backend rules, validation, and audit principles.

## Definition of Full
BF Shop is considered full when these outcomes are complete:
1. Orders can be placed on the customer side.
2. The same orders are received on the merchant side.
3. Merchant orders move correctly through workflow stages.
4. Customer chatbot is practically helpful.
5. Merchant AI assistant orchestrates meaningful time-saving tasks.
6. AI Overwatch gives one cohesive, centralized view of AI activity and control.

## Architecture Summary
- Two frontend surfaces: customer and merchant
- Shared backend contracts and business rule enforcement
- Database-backed order and fulfillment lifecycle
- AI assistants integrated through controlled backend tools
- Overwatch observability and governance for AI-driven actions

Detailed architecture source of truth:
- [docs/architecture.md](docs/architecture.md)

## Design and UI Standards
Design decisions are documented as enforceable source-of-truth standards (including spacing, typography, breakpoints, and merchant layout behavior).

Primary design standards:
- [docs/design-system.md](docs/design-system.md)

## Product Scope
Product scope, completion criteria, and merchant rendering rules are defined here:
- [docs/product-scope.md](docs/product-scope.md)

## Technology Direction
Current stack in this repository:
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

Planned core dependencies for full system scope:
- Prisma (database access)
- PostgreSQL-compatible database driver (Postgres or Supabase)
- Zod (schema and contract validation)
- n8n (workflow orchestration)

## Getting Started
1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open:

http://localhost:3000

## Available Scripts
- npm run dev
- npm run build
- npm run start
- npm run lint

## Documentation Index
- [README.md](README.md): Project overview and onboarding entrypoint
- [docs/product-scope.md](docs/product-scope.md): Scope, completion criteria, and surface responsibilities
- [docs/architecture.md](docs/architecture.md): Backend/domain architecture and execution lanes
- [docs/design-system.md](docs/design-system.md): Design rules, spacing, typography, and responsive standards

## Delivery Principle
Features are only considered complete when they work end-to-end across UI, backend validation, persistence, and observability.
