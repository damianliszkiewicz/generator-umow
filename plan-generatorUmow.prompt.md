## Plan: MVP Car Sale Agreement App (Risk-Adjusted)

Build a deployment-safe MVP with Clerk + Convex auth, step-by-step draft persistence, and a shared contract view-model powering both browser preview and PDF. To avoid serverless binary limits and cold-start instability, use @react-pdf/renderer for PDF generation, while keeping one normalized template source of truth at the content/view-model layer. Use proven Polish locale packages for number-to-words and checksum validators for PESEL/NIP/REGON.

**Steps**
1. Phase 1 — Foundation and dependency choices
   - Update /Users/damian/Projects/generator-umow/package.json with Clerk, React Hook Form, Zod, shadcn/ui prerequisites, @react-pdf/renderer, test tooling, and Polish validation helpers (including a number-to-words package for Polish, e.g. slownie).
   - Keep next.config.ts minimal unless an integration explicitly requires changes.
   - Create .env.example with complete Convex + Clerk variables and short setup hints.
   - Replace boilerplate app metadata/provider composition in /Users/damian/Projects/generator-umow/app/layout.tsx.
2. Phase 2 — Authentication and ownership boundaries
   - Add Clerk middleware and route protection for authenticated areas (dashboard, wizard, preview, PDF endpoint).
   - Add ConvexProviderWithAuth + Clerk token flow in app providers so Convex receives authenticated identity.
   - Create convex/auth.config.ts per Convex requirements and enforce ownership checks with ctx.auth.getUserIdentity() and identity.tokenIdentifier.
   - Keep user scoping in contracts table to reduce MVP complexity.
3. Phase 3 — Domain model and Polish validation
   - Centralize Zod schemas for seller, buyer, vehicle, sale terms, declarations, and draft metadata.
   - Enforce core rules: VIN length 17, positive price, required fields, Polish validation messages.
   - Add checksum validation helpers for PESEL, NIP, and REGON (even if some fields are future/optional), with clear required/optional semantics at form level.
   - Use a tested package for Polish number-to-words conversion instead of custom grammar logic.
4. Phase 4 — Convex schema and safe partial updates
   - Create convex/schema.ts with one contracts table containing nested sections, status, ownerTokenIdentifier, created/updated timestamps, and optional generatedPdf metadata.
   - Add indexes for owner listing and updated ordering.
   - Implement public Convex functions with validators: createDraft, getOwnedContract, listOwnedContracts, updateSection, and optional delete/archive.
   - Implement section updates with patch semantics and explicit deep-merge behavior so updating one section never erases previously saved sections.
   - Keep all authorization server-side; never accept user identity from client args.
5. Phase 5 — Route model and wizard transition contract
   - Use explicit route responsibilities:
     - /umowy/nowa handles only first step submission
     - On successful first step submit, Convex returns Id(contracts)
     - Next.js redirects immediately to /umowy/[id]/edytuj?step=kupujacy
   - /umowy/[id]/edytuj handles remaining steps and step navigation via query param.
   - /umowy/[id]/podglad renders preview from shared view-model.
   - Protected dashboard route lists drafts/history and links to edit/preview.
6. Phase 6 — Wizard UX and persistence behavior
   - Build step components for sprzedajacy, kupujacy, pojazd, warunki-sprzedazy, oswiadczenia, and podglad.
   - Use React Hook Form + step-specific Zod schemas.
   - Persist on each step submit (chosen behavior), then navigate to next step.
   - Back navigation should preserve server state without accidental resets.
   - Editing an existing contract preloads the step from Convex data.
7. Phase 7 — Shared preview and PDF architecture (serverless-safe)
   - Build one normalized agreement view-model mapper as the single source of truth for content, labels, section order, and derived values.
   - Implement two renderers over the same view-model:
     - Browser preview renderer (React/HTML)
     - PDF renderer using @react-pdf/renderer
   - Keep wording and ordering identical across both renderers via shared constants/sections.
   - Add a Next.js route handler that returns generated PDF bytes for an owned contract id.
8. Phase 8 — Testing critical paths
   - Validation tests: VIN, positive price, required fields, PESEL/NIP/REGON checksum behavior, and Polish message snapshots where practical.
   - Domain helper tests: title generation and Polish price-to-words conversion wrapper.
   - Convex tests (or targeted integration tests) for ownership enforcement and section update merge safety.
   - One high-value flow test for the wizard transition: /umowy/nowa -> createDraft -> redirect with contract id + next step.
9. Phase 9 — Documentation and handoff
   - Fully rewrite README setup and architecture sections: install, env vars, Clerk setup, Convex workflow, routes, tests, and deployment notes.
   - Document explicitly why @react-pdf/renderer was chosen for serverless reliability.
   - Ensure AGENTS.md remains consistent with final architecture and scope exclusions.

**Relevant files**
- /Users/damian/Projects/generator-umow/package.json — dependency/script updates for auth, forms, validation, PDF, tests.
- /Users/damian/Projects/generator-umow/app/layout.tsx — provider wiring and app metadata.
- /Users/damian/Projects/generator-umow/app/page.tsx — Polish entry behavior.
- /Users/damian/Projects/generator-umow/app/globals.css — minimal global + print-safe styles if needed.
- /Users/damian/Projects/generator-umow/next.config.ts — only if required.
- /Users/damian/Projects/generator-umow/middleware.ts — Clerk route protection.
- /Users/damian/Projects/generator-umow/.env.example — complete environment contract.
- /Users/damian/Projects/generator-umow/convex/auth.config.ts — Convex auth provider config.
- /Users/damian/Projects/generator-umow/convex/schema.ts — contracts table and indexes.
- /Users/damian/Projects/generator-umow/README.md — setup, architecture, runbook, limits.
- /Users/damian/Projects/generator-umow/AGENTS.md — keep aligned with delivered decisions.
- New modules expected under app/components/lib/convex for:
  - shared contract view-model mapping
  - preview renderer
  - PDF renderer
  - wizard step schemas and forms
  - Convex contract queries/mutations
  - validation and helper tests

**Verification**
1. Run install and confirm dependency tree resolves cleanly.
2. Start Next.js + Convex locally and verify Clerk-authenticated access to protected routes.
3. Submit first wizard step on /umowy/nowa and verify redirect to /umowy/[id]/edytuj?step=kupujacy.
4. Complete multiple steps and verify each submit persists without overwriting prior sections.
5. Verify ownership checks deny access to foreign contract ids.
6. Confirm validation behavior for VIN, PESEL/NIP/REGON, price, and required fields with Polish messages.
7. Compare preview and PDF outputs for identical section order/content from shared view-model.
8. Download PDF from route handler for an owned contract and validate file integrity.
9. Run lint and tests successfully.
10. Validate README setup from a clean clone.

**Decisions**
- Deployment assumption: treat as serverless-constrained by default (user is unsure target).
- PDF strategy: @react-pdf/renderer (selected) for reliability and lower deployment risk.
- Template consistency strategy: shared normalized view-model and section constants, not server-side HTML chromium rendering.
- Wizard transition: /umowy/nowa creates contract from first step, then redirect to /umowy/[id]/edytuj?step=kupujacy.
- Update semantics: Convex patch + explicit deep-merge safeguards for section updates.
- Polish text/number handling: use maintained package for price in words.
- Identifier validation scope: include checksum logic for PESEL, NIP, and REGON.

**Further Considerations**
1. If strict legal or UX requirements later demand pixel-identical HTML and PDF, reassess deployment target and optionally switch to dedicated PDF service (Gotenberg/API2PDF) while keeping current shared view-model.
2. If NIP/REGON are not surfaced in MVP forms, keep validators available but mark fields optional and clearly document activation criteria to avoid scope creep.
3. If step-by-step round trips affect UX on slower networks, add optimistic local caching while preserving Convex as source of truth.

**Implementation Watch-Outs**
1. Convex patch is shallow.
   - Rule: never assume nested object deep merge from db.patch.
   - For section updates, load the current contract first, merge in JavaScript at section level, then patch the merged object.
   - Guardrail: include a test proving a kupujacy update does not erase existing sprzedajacy or other nested fields.
2. @react-pdf/renderer must stay server-only in App Router.
   - Rule: run PDF generation only in route handlers or other server-only modules.
   - Use renderToStream or renderToBuffer in the PDF endpoint and keep PDF primitives out of client components.
   - Guardrail: enforce module boundaries so UI preview and PDF renderer share only view-model data, not runtime component code.
3. Avoid step-navigation form flashing.
   - Rule: do not mount step forms with empty defaults while draft data is unresolved.
   - Prefer Suspense-friendly data loading for edit routes, or gate form mount behind explicit loading state.
   - Guardrail: ensure step transitions preserve values without snap-fill behavior when moving between query-param steps.