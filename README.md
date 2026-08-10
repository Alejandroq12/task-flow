# Task Flow: Task Management App

![Task Flow running on desktop, laptop, tablet, and phone](src/assets/readme/readme.png)

Task Flow is a complete task management app built on a GraphQL API. You can browse, create, update, and organize tasks on a kanban-style dashboard.

## Live Demo

The app is deployed on Vercel: **[Task Flow](https://task-flow-iota-lime.vercel.app/)**

## Tech Stack

- **Framework:** React 19 + TypeScript (strict)
- **Build tool:** Vite
- **Routing:** React Router (`createBrowserRouter`)
- **Styling:** Tailwind CSS v4 with design tokens that mirror the Figma design system
- **Data:** TanStack Query + graphql-request, with GraphQL Code Generator for end-to-end typed operations
- **Testing:** Vitest + React Testing Library
- **Linting/Formatting:** ESLint (flat config, typescript-eslint type-checked) + Prettier
- **CI/CD:** GitHub Actions for CI (format check, lint, typecheck, tests, and build on every PR) + Vercel Git integration for CD (auto-deploy on merge, preview deployment per PR)

## Setup & Running Locally

You need Node 24.14.1 or newer (see `.nvmrc`). That's the first Node 24 release whose bundled npm satisfies the `min-release-age` support floor (the feature landed in npm 11.10.0).

```bash
git clone https://github.com/Alejandroq12/task-flow.git
cd task-flow
npm install
cp .env.example .env.local   # then fill in the API URL and access token from the challenge instructions
npm run dev
```

The app runs at `http://localhost:5173`. That's the whole setup.

### Environment variables

| Variable    | Description                                             |
| ----------- | ------------------------------------------------------- |
| `API_URL`   | GraphQL endpoint of the project API                     |
| `API_TOKEN` | Personal access token (attached server-side, see below) |

Real values live in `.env.local`, which is gitignored. Never commit tokens. `npm run codegen` needs both variables too. `.env.example` ships placeholders for both on purpose: the repo is public, the endpoint is internal to the challenge, and anyone who needs it already has it from the instructions.

> **Security note:** the token is deliberately not `VITE_`-prefixed. Vite inlines `VITE_*` variables into the public JS bundle, where anyone can extract them. Instead, the app calls the relative path `/graphql`, and the dev server proxies that to the real API, attaching the `Authorization` header in Node (see `vite.config.ts`). The token never reaches the browser. A deployed build needs the same proxy as a serverless function; the static bundle alone can't do that job, and it must never carry the token. That proxy would itself need caller authentication and rate limiting, because an open proxy holding a shared token is an open relay to the API. `API_URL` must be `https` (enforced at startup), so the token never travels over plaintext.

### Deploying (Vercel)

The static bundle holds no API URL or token, so the deployment carries its own Node-side proxy. `api/graphql.ts` is a Vercel serverless function that forwards `POST /api/graphql` to the real API with the Bearer header attached server-side. `vercel.json` rewrites `/graphql` to it (so the client code is identical in every environment) and falls back to `index.html` for client-side routes. Setup: add `API_URL` and `API_TOKEN` (same names as `.env.local`) under Project → Settings → Environment Variables, then redeploy.

**Accepted risk for this challenge:** the function has no caller authentication or rate limiting, so the deployed URL is an open relay to the challenge API (see the security note above). That's fine for a graded demo holding a scoped challenge token, not for production.

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

> **Note on `npm run codegen`:** you don't need it after cloning. The generated GraphQL code is committed (`src/graphql/generated/`) so the app typechecks, builds, and runs on what's already in the repo. Run it only when you change a query or mutation, or when the API schema itself changes, and it needs both environment variables set.

## Project Structure

```text
src/
  app/          # App shell: router, route-level pages (NotFound, RouteError) + tests
  components/
    layout/     # Structural components (Layout with sidebar/header slots)
    ui/         # Shared, reusable UI components (used by 2+ features)
  features/     # Feature modules: components/hooks/types owned by one feature
    tasks/      #   dashboard, task cards, task mutations
    settings/   #   user profile page
  graphql/
    generated/  # created by `npm run codegen` (do not edit by hand)
  lib/          # cross-cutting setup (GraphQL client, TanStack QueryClient)
  test/         # test setup (jest-dom matchers)
```

## Rationale & Decisions

**Why this folder structure?**

Feature-based instead of type-based. Everything a feature owns (components, hooks, types) lives in its own folder, so `features/tasks` could keep growing with cards, modals, menus, the date picker, and filters without me hunting through a global `components/` pile. A piece moves to `components/ui` when a second feature actually needs it, not before. Features never import from each other, so the only inbound edges are the router and its tests. Deleting a feature means removing its folder plus its route entry, and nothing else in the app would notice. The payoff is a boring dependency graph, which is exactly what I want in a codebase.

**Why this styling solution?**

Tailwind CSS v4 with `@theme` tokens named after the Figma color styles. The important decision isn't Tailwind itself but what I removed: I cleared the stock color, text, shadow, and tracking namespaces, so a class like `text-red-500` doesn't exist in this project. In those namespaces, the only utilities that compile are the ones generated from the design system tokens. Layout utilities like `flex` and `p-4` stay stock, and arbitrary values like `bg-[#fff]` could still slip through, which is why those count as review findings. The build enforces most of the visual side of design fidelity instead of leaving it for a reviewer to catch, and it keeps the Figma-to-code mapping literal: the mockup says Neutral 4, the class says `bg-neutral-4`.

**Why this data-fetching approach?**

TanStack Query + graphql-request + GraphQL Code Generator. Apollo was the obvious candidate and I looked at it first, but its centerpiece is a normalized cache, and this app doesn't have the problem that solves: there's one main query and a handful of mutations. What I actually needed was server-state management: caching, loading and error states, retries, and cache invalidation after a mutation. That's exactly TanStack Query's job, and it does it with far less API surface. Underneath it, graphql-request is a small typed fetcher, and codegen generates TypeScript types straight from the API schema, so a query result is typed end to end without hand-written interfaces that could drift from reality.

The tradeoff I accepted: with no normalized cache, updates work by invalidate-and-refetch instead of surgical cache writes. That costs an extra round trip after each mutation, and it still depends on invalidating the right query keys. But with one main query there's only one key family to get right, and the server stays the single source of truth instead of a hand-maintained cache that can drift from it.

**What I'd do differently with more time:**

Drag and drop between columns is the feature I most wanted to reach. The groundwork is already in place: the API's `position` field is a `Float` precisely so a card can drop between two others without renumbering the whole column, and the create/update flows already send it. But doing drag and drop accessibly (keyboard support, screen reader announcements) deserves more than a rushed afternoon.

I'd also add optimistic updates: today every mutation invalidates and refetches, which keeps the UI honest with the server but feels one round trip slower than it could be. And I'd grow the test suite. Near the deadline I made a deliberate call: no new tests, keep the existing suite green in CI, and verify every new feature in a real browser instead. I still think that was the right trade under the clock, but the coverage debt is real and I'd pay it down first.

## What's Implemented

- [x] Initial setup: folder structure, routing, styles solution, linting/formatting, error boundary, tests, CI
- [x] Dashboard UI (static): sidebar with mobile drawer, header, toolbar, five status columns, task cards
- [x] API connection: the app fetches tasks into their status columns, with a loading skeleton, a failure alert with retry, and an empty state
- [x] Create task: the + buttons open a Figma-matched modal (a full-screen page on mobile, a floating panel on desktop) with custom estimate, assignee, and tag menus, plus per-breakpoint date pickers. Submitting calls createTask, invalidates the cache, and handles errors
- [x] Update task: Edit lives in the card/list options menu and reuses the shared TaskForm with all six required editable fields (name, due date, position, status, tags, estimate) plus assignee. Success and failure both trigger notifications
- [x] Delete task: the options menu opens a 'Delete Task?' confirmation, which calls deleteTask by id. Success and failure both trigger notifications
- [x] View toggle & My Task: grid and list layouts on both views (the list is the mockup's grouped table with due-date row indicators), switched by the toolbar icons on desktop and the Dashboard/Task tabs on mobile. My Task filters to tasks assigned to the logged-in user via the profile query
- [x] Search & filter: the header search and five filter chips (status, estimate, tags, due date, owner) live in URL search params, combine freely, and show a dedicated empty-results state when nothing matches
- [x] User settings page: reached from a Settings sidebar item and by clicking the header avatar. The sidebar item shares the NavLink anatomy of Dashboard and My Task, and the design system documents its SidebarItem as an abstract component, which sanctions adding a third item. /settings renders the profile query (full name, email, type chip, created/updated dates) in an invented card design built from the app's own tokens. The requirement's Position field doesn't exist on the API's User type (verified by introspection), so the row says so instead of fabricating a value

## Bonus Points

- **Total count of tasks by column:** board column headers and list group headers both carry live counts.
- **Layout toggle (columns ↔ list):** the desktop icon switcher and the mobile Dashboard/Task tabs drive one shared selection that survives navigation and resizes.
- **Due-date colors:** green on time, amber under two days, red overdue. One rule (`dueInfo` in `task-display.ts`) drives the card date chips, the list view's row indicators, and the list date text. The mockup shows only the red/neutral chip states; the requirement asks for three colors, and requirements outrank mockups.
- **Add-task animation:** after a create, the board refetches, scrolls the new card into view, and the card fade-rises in. React reconciles by task id, so only the genuinely new card mounts and animates; the rest of the board stays put. Under reduced-motion preferences, the scroll is instant and the entrance animation is disabled.

## Additional Notes

- **Generated GraphQL code is committed on purpose.** `src/graphql/generated/` (the output of `npm run codegen`) is checked into git so CI can typecheck and build without holding the API token. Regenerate after changing any query or mutation, or when the API schema changes; never edit it by hand.
- **Quality gates are CI-enforced, not hook-enforced.** The repo deliberately has no git hooks (husky/lint-staged). CI runs format check, lint, typecheck, tests, and build on every PR, and the same scripts run locally on demand. Hooks can be added later if commit-time enforcement proves necessary.
- **The settings Position row says "Not provided by the API."** The requirement lists Position among the user fields, but the User type has no such field (introspection: fullName, email, type, avatar, createdAt, updatedAt). The row still renders so the requirement's shape is visible, with an honest value instead of an invented one.
- **Filter state lives in the URL.** Search and filters are `?q=…&status=…` search params, not component state, so filtered views are shareable, bookmarkable, and survive reloads. Search-param changes don't remount the page (the error boundary keys on pathname only). Three observed API behaviors are documented here instead of papered over. Name matching is a **case-sensitive** substring (verified: `icket` matches `Ticket5`, `ticket` does not). `dueDate` filters by **exact timestamp** equality; this app writes all due dates at noon UTC, so day-level filtering works for tasks it created. `ownerId` is accepted but **ignored by the server** (a nonexistent id returns the full task list); the param is still sent as required, and the owner filter also applies client-side against the task's `creator.id`, so the control does what it says.
- **Tag labels derive from the API enum.** The mockups show sample tag texts that contradict each other across surfaces: the same tag renders "IOS APP" on cards but "IOS" in the tag menu, "ANDROID" on cards but "Android App" in the menu. Since the API's TaskTag enum is the real domain, labels derive from the enum values (IOS, ANDROID, REACT, NODE JS, RAILS) and are identical everywhere.
- **List group-header hover icons are omitted.** One mockup group header shows +/… icons; they have no behavior behind them (non-working UI).
- **List rows have an actions column the mockup lacks.** The requirement ties update/delete to the options icon, and a list-only user would otherwise have no way to reach them. The requirement wins over the drawing, so each row ends with the same options menu the cards use.
- **List-view row borders follow the due date.** The mockup's task table shows rows with identical dates but different left-border colors, an inconsistency the team acknowledged in Slack ("we use to have those in real projects"). Per the team's guidance that the border is a due-date indicator, the rule is: overdue = red (primary), due within two days = amber (tertiary), later = green (secondary).
- **The header bell is THE notification system.** Mutation successes and failures land in a notification center the bell opens (unread dot, ten-entry history, marked read on open). Failures also surface as inline alerts in the dialog that caused them, so errors are impossible to miss. I built transient toasts first and deliberately removed them: two presentations of the same event stream duplicated a function, and the bell is the one the Figma shows. The panel's own design has no mockup, so it reuses the app's menu anatomy.
- **Card attachment/fork/comment icons are omitted.** The Figma shows those metrics on task cards, but the API's Task type exposes no fields for them. Mentor guidance says not to expose non-working UI, so the icons stay out until the schema provides the data.
- **Node 24 is a hard requirement.** `.npmrc` sets `engine-strict=true`, so `npm install` fails fast on older Node instead of warning.
- **A11y deviation from the design, flagged and recommended per mentor guidance:** the Figma's active-tab red (`primary-4`, `#da584b`) on the dark surface measures ≈3.5:1, below WCAG AA's 4.5:1 for 15px text. Following the design team's process (flag + recommend), the active label uses `primary-3` (`#e27d73`), one step up the design system's own red scale, which measures ≈4.7:1 (≈4.5:1 worst-case over the 5% gradient wash). The indicator bar stays `primary-4`: it's a non-text graphic, so the 3:1 rule applies, and it passes. The active state is also conveyed non-visually via `aria-current="page"`.
