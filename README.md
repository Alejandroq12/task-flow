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

Requires Node 24.14.1+ (see `.nvmrc`) — the first Node 24 release whose bundled npm satisfies the `min-release-age` support floor (the feature landed in npm 11.10.0).

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

> **Security note:** the token is deliberately not `VITE_`-prefixed. Vite inlines `VITE_*` variables into the public JS bundle, where anyone could extract them. Instead, the app calls the relative path `/graphql`, and the dev server proxies it to the real API, attaching the `Authorization` header in Node (see `vite.config.ts`). The token never reaches the browser. A deployed build would need the same proxy as a serverless function — the static bundle alone cannot, and must not, carry the token — and that proxy would itself need caller authentication and rate limiting, since an open proxy holding a shared token is effectively an open relay to the API. `API_URL` must be `https` (enforced at startup); the token never travels over plaintext.

### Deploying (Vercel)

The static bundle holds no API URL or token, so the deployment carries its own Node-side proxy: `api/graphql.ts` is a Vercel serverless function that forwards `POST /api/graphql` to the real API with the Bearer header attached server-side, and `vercel.json` rewrites `/graphql` to it (so the client code is identical in every environment) plus falls back to `index.html` for client-side routes. Setup: add `API_URL` and `API_TOKEN` (same names as `.env.local`) under Project → Settings → Environment Variables, then redeploy. **Accepted risk for this challenge:** the function has no caller authentication or rate limiting, so the deployed URL is an open relay to the challenge API (see the security note above) — acceptable for a graded demo holding a scoped challenge token, not for production.

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
- [x] Dashboard UI (static): sidebar with mobile drawer, header, toolbar, five status columns, task cards
- [x] API connection — fetch tasks into their status columns, with loading skeleton, failure alert + retry, and empty state
- [x] Create task — the + buttons open a Figma-matched modal (full-screen page on mobile, floating panel on desktop) with custom estimate/assignee/tag menus and per-breakpoint date pickers; createTask + cache invalidation + error handling
- [x] Update task — Edit via the card/list options menu, reusing the shared TaskForm with all six required editable fields (name, due date, position, status, tags, estimate) plus assignee; success/failure notifications
- [x] Delete task — 'Delete Task?' confirmation via the options menu, deleteTask by id, success/failure notifications
- [x] View toggle & My Task — grid/list layouts on both views (list = the mockup's grouped table with due-date row indicators), switched by the toolbar icons on desktop and by the Dashboard/Task tabs on mobile; My Task filters to tasks assigned to the logged-in user via the profile query
- [x] Search & filter — the header search and five filter chips (status, estimate, tags, due date, owner) live in URL search params, combine freely, and show a dedicated empty-results state when nothing matches
- [x] User settings page — reached from a Settings sidebar item — rendered with the same NavLink anatomy as Dashboard and My Task; the design system documents its SidebarItem as an abstract component, which is what sanctions adding a third item — and by clicking the header avatar; /settings renders the profile query (full name, email, type chip, created/updated dates) in an invented card design built from the app's own tokens; the requirement's Position field does not exist on the API's User type (verified by introspection), so the row states that instead of fabricating a value

## Bonus points

- **Total count of tasks by column** — board column headers and list group headers both carry live counts.
- **Layout toggle (columns ↔ list)** — the desktop icon switcher and the mobile Dashboard/Task tabs drive one shared selection that survives navigation and resizes.
- **Due-date colors** — green on time, amber under two days, red overdue: one rule (`dueInfo` in `task-display.ts`) drives the card date chips, the list view's row indicators, and the list date text. The mockup only shows the red/neutral chip states; the requirement asks for three colors, and requirements outrank mockups.
- **Add-task animation** — after a create, the board refetches, scrolls the new card into view, and the card fade-rises in. React reconciles by task id, so only the genuinely new card mounts and animates — one task created, one card animated, never the whole board. The scroll is instant and the entrance animation is disabled under reduced-motion preferences.

## Additional Notes

- **Generated GraphQL code is committed on purpose.** `src/graphql/generated/` (output of `npm run codegen`) is checked into git so CI can typecheck and build without holding the API token. Regenerate after changing any query/mutation; never edit by hand.
- **Quality gates are CI-enforced, not hook-enforced.** There are deliberately no git hooks (husky/lint-staged): CI runs format check, lint, typecheck, tests, and build on every PR, and the same scripts run locally on demand. Hooks can be added later if commit-time enforcement proves necessary.
- **The settings Position row says "Not provided by the API."** The requirement lists Position among the user fields, but the User type has no such field (introspection: fullName, email, type, avatar, createdAt, updatedAt). The row is rendered so the requirement's shape is visible, with an honest value instead of an invented one.
- **Filter state lives in the URL.** Search and filters are `?q=…&status=…` search params, not component state: filtered views are shareable/bookmarkable, survive reloads, and search-params changes don't remount the page (the error boundary keys on pathname only). Three observed API behaviors are documented rather than papered over: name matching is a **case-sensitive** substring (verified: `icket` matches `Ticket5`, `ticket` does not); `dueDate` filters by **exact timestamp** equality (this app writes all due dates at noon UTC, so day-level filtering works for tasks it created); and `ownerId` is accepted but **ignored by the server** (a nonexistent id returns the full task list) — the param is still sent as required, and the owner filter additionally applies client-side against the task's `creator.id` so the control does what it says.
- **Tag labels derive from the API enum.** The mockups show sample tag texts that contradict each other across surfaces (the same tag renders "IOS APP" on cards but "IOS" in the tag menu, "ANDROID" on cards but "Android App" in the menu). Since the API's TaskTag enum is the real domain, labels derive from the enum values (IOS, ANDROID, REACT, NODE JS, RAILS) and are identical everywhere.
- **List group-header hover icons are omitted.** One mockup group header shows +/… icons; they have no behavior behind them (non-working UI, same principle as the bell).
- **List rows have an actions column the mockup lacks.** The requirement ties update/delete to the options icon, and a list-only user would otherwise have no way to reach them — requirements outrank mockups, so each row ends with the same options menu the cards use.
- **List-view row borders follow the due date.** The mockup's task table shows rows with identical dates but different left-border colors — an inconsistency the team acknowledged in Slack ("we use to have those in real projects"). Per the team's guidance that the border is a due-date indicator, the rule implemented is: overdue = red (primary), due within two days = amber (tertiary), later = green (secondary).
- **The header bell is THE notification system.** Mutation successes and failures are recorded to a notification center the bell opens (unread dot, ten-entry history, marked read on open); failures additionally surface as inline alerts in the dialog that caused them, so errors are impossible to miss. Transient toasts were built first and deliberately removed — two presentations of the same event stream duplicated a function; the bell is the one the Figma shows. The panel's own design has no mockup, so it reuses the app's menu anatomy. The card metric icons below stay omitted because their data provably does not exist in the schema — the bell's does.
- **Card attachment/fork/comment icons are omitted.** The Figma shows those metrics on task cards, but the API's Task type exposes no fields for them. Per mentor guidance not to expose non-working UI, the icons are removed until the schema provides the data; the SVGs live in git history for easy reintroduction.
- **Node 24 is a hard requirement** — `.npmrc` sets `engine-strict=true`, so `npm install` fails fast on older Node instead of warning.
- **A11y deviation from the design, flagged and recommended per mentor guidance:** the Figma's active-tab red (`primary-4`, `#da584b`) on the dark surface measures ≈3.5:1 below WCAG AA's 4.5:1 for 15px text. Following the design team's process (flag + recommend), the active label uses `primary-3` (`#e27d73`) one step up the design system's own red scale measuring ≈4.7:1 (≈4.5:1 worst-case over the 5% gradient wash). The indicator bar stays `primary-4` (non-text graphic, 3:1 rule, passes). The active state is also conveyed non-visually via `aria-current="page"`.

<!-- TODO: anything else worth mentioning — known limitations, things I'd want feedback on, etc. -->
