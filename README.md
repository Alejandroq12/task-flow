# Task Flow — Task Management App

Task Flow is a task management app I'm building on top of a GraphQL API — browse, create, update, and organize tasks on a kanban-style dashboard.

## Live Demo

<!-- TODO: add once deployed (Vercel/Netlify) -->

_Live app and video walkthrough coming soon._

## Screenshots

<!-- TODO: add screenshots or GIFs of the working app once Phase 2/3 are done -->
<!-- Tip: record a short GIF of drag-and-drop and the create/edit flow, that sells the project fastest -->

## Tech Stack

- **Framework:** React 19 + TypeScript (strict)
- **Build tool:** Vite
- **Routing:** React Router (`createBrowserRouter`)
- **Styling:** Tailwind CSS v4 with design tokens mirroring the Figma design system
- **Data:** TanStack Query + graphql-request, with GraphQL Code Generator for end-to-end typed operations
- **Testing:** Vitest + React Testing Library
- **Linting/Formatting:** ESLint (flat config, typescript-eslint type-checked) + Prettier
- **CI:** GitHub Actions — format check, lint, typecheck, tests, and build on every PR

## Setup & Running Locally

Requires Node 24 (see `.nvmrc`).

```bash
git clone https://github.com/Alejandroq12/task-flow.git
cd task-flow
npm install
cp .env.example .env.local   # then add the project access token
npm run dev
```

The app runs at `http://localhost:5173`.

### Environment variables

| Variable    | Description                                             |
| ----------- | ------------------------------------------------------- |
| `API_URL`   | GraphQL endpoint of the project API                     |
| `API_TOKEN` | Personal access token (attached server-side, see below) |

Real values live in `.env.local`, which is gitignored — never commit tokens. Both variables are also required by `npm run codegen`.

> **Security note:** the token is deliberately not `VITE_`-prefixed. Vite inlines `VITE_*` variables into the public JS bundle, where anyone could extract them. Instead, the app calls the relative path `/graphql`, and the dev server proxies it to the real API, attaching the `Authorization` header in Node (see `vite.config.ts`). The token never reaches the browser. A deployed build would need the same proxy as a serverless function — the static bundle alone cannot, and must not, carry the token.

### Available scripts

```bash
npm run dev           # start dev server
npm run build         # typecheck + production build
npm run lint          # run ESLint
npm run typecheck     # run tsc -b (project references)
npm test              # run unit tests once (vitest)
npm run test:watch    # run tests in watch mode
npm run format        # format with Prettier
npm run format:check  # verify formatting (used in CI)
npm run codegen       # generate typed GraphQL operations from the API schema
npm run preview       # preview production build locally
```

## Project Structure

```text
src/
  app/          # App shell: router, route-level pages (NotFound, RouteError) + tests
  components/
    layout/     # Structural components (Layout with sidebar/header slots)
    ui/         # Shared, reusable UI components (used by 2+ features)
  features/     # Feature modules — components/hooks/types owned by one feature
    tasks/      #   dashboard, task cards, task mutations
    settings/   #   user profile page
  graphql/
    generated/  # created by `npm run codegen` (do not edit by hand)
  lib/          # cross-cutting setup (GraphQL client, TanStack QueryClient)
  test/         # test setup (jest-dom matchers)
```

## Rationale & Decisions

<!-- TODO: this section matters as much as the code — I will fill it in as I go, not all at the end -->

**Why this folder structure?**

<!-- Feature-based over type-based because... -->

**Why this styling solution?**

<!-- Tailwind v4 with @theme tokens named after the Figma color styles because... -->

**Why this data-fetching approach?**

<!-- TanStack Query + graphql-request + codegen: what I chose and the tradeoff against alternatives (Apollo, urql) -->

**What I'd do differently with more time:**
<!-- honest reflection — this is a strong signal in review, not a weakness to hide -->

## What's Implemented

- [x] Initial setup (folder structure, routing, styles solution, linting/formatting, error boundary, tests, CI)
- [ ] Dashboard UI (static)
- [ ] API connection — fetch tasks, loading/error/empty states
- [ ] Create task
- [ ] Update task
- [ ] Delete task
- [ ] Search & filter
- [ ] User settings page

### Bonus points attempted

<!-- TODO: list which bonus features I tackled, if any -->

## Additional Notes

- **Generated GraphQL code is committed on purpose.** `src/graphql/generated/` (output of `npm run codegen`) is checked into git so CI can typecheck and build without holding the API token. Regenerate after changing any query/mutation; never edit by hand.
- **Quality gates are CI-enforced, not hook-enforced.** There are deliberately no git hooks (husky/lint-staged): CI runs format check, lint, typecheck, tests, and build on every PR, and the same scripts run locally on demand. Hooks can be added later if commit-time enforcement proves necessary.
- **Node 24 is a hard requirement** — `.npmrc` sets `engine-strict=true`, so `npm install` fails fast on older Node instead of warning.

<!-- TODO: anything else worth mentioning — known limitations, things I'd want feedback on, etc. -->
