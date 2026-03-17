# BF Shop Architecture Source of Truth

## System Model
BF Shop is a full-stack commerce operations system with two primary frontends and one shared backend domain:
- Customer frontend
- Merchant frontend
- Backend APIs + database

All business-critical actions resolve through the same backend validation and policy layer.

## Two Execution Lanes
1. Deterministic lane
- User UI action -> backend API -> validation/rules -> database -> UI response

2. AI lane
- User prompt -> AI interpretation -> approved backend tool call -> validation/rules -> database -> response

The AI lane never bypasses backend rules.

## Domain Capabilities
- Products and inventory management
- Order lifecycle management
- Customer and merchant workflow operations
- AI assistants with controlled action boundaries
- Overwatch observability, governance, and risk controls

## Data and Backend Baseline
Primary stack direction:
- Prisma for database access
- PostgreSQL-compatible database (Postgres or Supabase)
- Zod for request/response validation and contract safety

## Core Entity Direction
- products
- orders
- order_items
- customers
- audit_events
- capabilities
- integrations

## Fulfillment Lifecycle
Baseline order state progression:
- received -> sent -> delivered

Rules:
- State transitions must be validated server-side.
- Inventory and pricing checks must happen on checkout.
- Order snapshots must preserve purchased item details at transaction time.

## AI Safety Boundary
- AI can suggest and request actions.
- Backend decides if actions are allowed.
- High-risk actions should support explicit approval gates.
- All AI-originated actions should be auditable.

## Integration Direction
- n8n workflows should be treated as external actors that call approved backend contracts.
- Integrations should be visible from a central control surface.
