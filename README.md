# Generator umowy kupna-sprzedazy samochodu

MVP web application for generating Polish car sale agreements.

## Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Convex (database + backend functions)
- Clerk (authentication)
- React Hook Form
- Zod
- @react-pdf/renderer

## Core scope
- Poland only
- private seller to private buyer
- one vehicle per contract
- Polish UI copy only
- saved drafts
- contract preview
- PDF generation
- contract history dashboard

## Not in MVP
- companies, co-owners, multiple vehicles
- DOCX export
- e-signature
- OCR
- external registry integrations
- organizations / multi-tenant

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy values from [.env.example](.env.example) into `.env.local`.

Required variables:
- `NEXT_PUBLIC_CONVEX_URL`
- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_JWT_ISSUER_DOMAIN`

### 3. Configure Clerk JWT template for Convex
In Clerk dashboard create JWT template named `convex`.
Convex uses this token template via `getToken({ template: "convex" })`.

### 4. Run Convex dev watcher
```bash
npx convex dev
```

### 5. Run Next.js app
```bash
npm run dev
```

App starts at `http://localhost:3000`.

## Routes
- `/` landing page
- `/sign-in` sign in
- `/sign-up` sign up
- `/dashboard` protected contract dashboard
- `/umowy/nowa` first wizard step (seller) and contract creation
- `/umowy/[id]/edytuj?step=...` remaining wizard steps
- `/umowy/[id]/podglad` preview
- `/api/umowy/[id]/pdf` server-side PDF download

## Data and auth architecture
- Clerk handles session and UI auth.
- Convex handles persistence, ownership checks, and contract CRUD.
- Contract ownership is always derived from `ctx.auth.getUserIdentity()` and `identity.tokenIdentifier`.
- Preview and PDF use one shared view-model mapper to keep content ordering and wording aligned.

## Validation rules
- VIN must be exactly 17 characters.
- Price must be positive.
- Required fields are validated with Polish messages.
- PESEL, NIP, and REGON use checksum validators.
- Price in words is generated via `slownie` wrapper.

## Tests
Run:

```bash
npm run test
```

Covered critical paths:
- checksum validators (PESEL/NIP/REGON)
- schema-level validation (VIN/price/required fields)
- section merge safety helper
- price words helper behavior

## Lint
```bash
npm run lint
```

## Deployment notes
- PDF generation uses `@react-pdf/renderer` in a Node.js route handler (`/api/umowy/[id]/pdf`) to avoid heavy Chromium dependencies.
- If strict HTML-to-PDF parity is required later, consider a dedicated PDF service while keeping the shared view-model layer unchanged.