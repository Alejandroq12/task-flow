# Task Flow — Task Management App

A task management application built to manage your task to be super productive, connecting to a GraphQL API to browse, create, update, and organize tasks across a kanban-style dashboard.

## 🚀 Live Demo

<!-- TODO: add once deployed (Vercel/Netlify) -->
[Live app](#) · [Video walkthrough / GIF](#)

## 📸 Screenshots

<!-- TODO: add screenshots or GIFs of the working app once Phase 2/3 are done -->
<!-- Tip: record a short GIF of drag-and-drop and the create/edit flow, that sells the project fastest -->

## 🛠 Tech Stack

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite
- **Routing:** React Router
- **Styling:** <!-- TODO: Tailwind CSS / CSS Modules — work in progress -->
- **Data fetching:** <!-- TODO: fill in once Phase 3 is implemented (e.g. Apollo Client / urql / TanStack Query + GraphQL) -->
- **Linting/Formatting:** ESLint (flat config, typescript-eslint) + Prettier
- **CI:** GitHub Actions (lint, typecheck, build on every PR)

## 📋 Setup & Running Locally

```bash
git clone <my-repo-url>
cd task-flow
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Environment variables

<!-- TODO: add a .env for the API URL, document it here: -->
<!-- VITE_API_URL.... -->

### Available scripts

```bash
npm run dev         # start dev server
npm run build        # production build
npm run lint          # run ESLint
npm run typecheck   # run tsc --noEmit
npm run preview      # preview production build locally
```

## Project Structure

```
src/
  app/          # App shell: router, providers, layout
  features/     # Feature-based modules (tasks, settings)
  components/   # Shared, reusable UI components
  lib/          # API client / GraphQL setup
  types/        # Shared TypeScript types
```

## Rationale & Decisions

<!-- TODO: this section matters as much as the code — I will fill it in as I go, not all at the end -->

**Why this folder structure?**
<!-- e.g. feature-based over type-based because... -->

**Why this styling solution?**
<!-- e.g. Tailwind for fast iteration against the Figma design tokens -->

**Why this data-fetching approach?**
<!-- I must fill in once Phase 3 is done — what I chose and the tradeoff against alternatives -->

**What I'd do differently with more time:**
<!-- honest reflection — this is a strong signal in review, not a weakness to hide -->

## What's Implemented

<!-- TODO: I must keep this checklist updated as I complete each phase — makes review much easier -->

- [ ] Initial setup (folder structure, routing, styles, linting, error boundary, CI)
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

<!-- TODO: anything else worth mentioning — known limitations, things I'd want feedback on, etc. -->
