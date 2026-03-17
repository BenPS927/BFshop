# BF Shop Product Scope

## Product Goal
Build a full business system with two frontend surfaces, a shared backend, and a production-ready data model:
- Customer storefront for browsing and placing orders
- Merchant operations frontend for order fulfillment
- AI enhancements across both surfaces
- AI Overwatch as centralized governance and visibility
- Workflow automations where useful (including n8n)

## What Full Means
The project is considered full when these outcomes are true:
1. Orders can be placed on the customer side.
2. The same orders appear on the merchant side.
3. Merchant orders move correctly between workflow stages.
4. Customer chatbot provides useful support.
5. Merchant AI assistant orchestrates time-saving tasks safely.
6. AI Overwatch provides one cohesive view of AI activity and controls.
7. The most basic iteration of session work is included for core user flows.

## Core Surfaces
1. Customer Frontend
- Product discovery, cart, checkout, order placement
- AI chatbot for questions, support, and order guidance

2. Merchant Frontend
- Operational order board and order lifecycle actions
- AI assistant for execution support and orchestration
- AI Overwatch control center

3. Backend + Data
- Shared API and business rules for both manual and AI actions
- Database-backed order lifecycle with auditable events

## Merchant Board Rules
- Keep one mobile layout and one large-screen layout.
- Mobile shows one column at a time.
- Large screens show all columns at once.
- Columns must be rendered from one shared columns array to avoid duplicated logic.

## AI Overwatch Scope
AI Overwatch acts as the control center for AI behavior in the merchant side.
Minimum scope includes:
- Activity logs
- Capability registry
- Centralized visibility of AI inputs/actions

## Workflow Automation
- Use n8n for targeted workflow automations where there is measurable operational value.
- All automated actions should still flow through backend validation and audit rules.

## Delivery Principle
A feature is complete only when:
- UI flow works end-to-end,
- backend rules enforce correctness,
- data persistence is reliable,
- and the path is observable through logs/audit context.
