# AGENTS.md

## Product
This repository contains an MVP web app for generating Polish car sale agreements ("umowa kupna-sprzedaży samochodu").

## Stack
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Convex for backend, database, queries, mutations, and domain logic
- Clerk for authentication
- React Hook Form
- Zod

## Product scope
MVP supports:
- Poland only
- private seller to private buyer
- one vehicle per contract
- Polish language only
- saved drafts
- contract preview
- PDF generation
- contract history dashboard

Not in MVP:
- company parties
- co-owners
- multiple vehicles in one contract
- DOCX export
- e-signature
- OCR
- external vehicle registry integrations
- organizations / multi-tenant

## Architecture rules
- Next.js handles pages, routing, UI, and PDF route handlers
- Convex handles persistence, ownership, queries, mutations, and business logic
- Clerk handles authentication and session state
- Keep preview and PDF based on the same template data source
- Keep all validation schemas centralized
- Prefer simple, explicit code over abstractions
- Use server components where sensible
- Use client components only where interaction is needed
- Do not introduce Prisma, REST backend layers, or unnecessary service wrappers

## Domain rules
- VIN must be exactly 17 characters
- price must be positive
- every contract belongs to the authenticated user
- contract contains seller, buyer, vehicle, sale terms, declarations, and notes
- price should be rendered both numerically and in words
- preview and PDF should match as closely as possible

## Delivery rules
- Update README when setup changes
- Keep .env.example complete
- Use Polish labels and validation messages in user-facing UI
- Keep naming aligned with business domain
- Write tests for validation and critical flows
- Avoid premature abstraction and over-engineering

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
