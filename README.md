# Harmedino — community blog

A modern, full-featured blogging platform: anyone can sign up, write posts in Markdown, and publish them for readers everywhere.

**Live:** https://blog-site-beryl.vercel.app · **API:** [Harmedino/Blog-backend-NODE](https://github.com/Harmedino/Blog-backend-NODE)

![CI](https://github.com/Harmedino/Blog-site-with-REACT/actions/workflows/ci.yml/badge.svg)

## Features

**Readers**
- Search by title, author, tag or content, filter by topic and sort — all synced to the URL so any view is shareable
- Articles open without an account, with reading time, a reading-progress bar and related posts
- Markdown rendering (headings, lists, code blocks, tables, links)
- Share to X, LinkedIn, WhatsApp, or copy the link (native share sheet on mobile)
- Light / dark theme that follows the system, with no flash on load

**Writers**
- Markdown editor with a formatting toolbar and live preview
- Drafts autosave to the device and restore on return
- Drag-and-drop cover image with type/size validation
- Warns before you leave with unsaved changes
- Dashboard with post stats, status filters, edit and delete
- Profile settings

**Under the hood**
- Every route is code-split and loaded on demand
- Server state cached and de-duplicated with TanStack Query (one `verifyToken` call instead of one per page)
- Session expires automatically from the JWT `exp` claim; a rejected token signs you out cleanly
- Accessible: semantic landmarks, skip link, labelled controls, focus rings, `prefers-reduced-motion`
- Old URLs (`/blogList`, `/more/:id`, `/profile`…) redirect to their new homes

## Tech stack

| Area | Choice |
|---|---|
| Build | Vite |
| UI | React 19 + TypeScript (strict) |
| Styling | Tailwind CSS v4 + Typography plugin |
| Routing | React Router 7 (data router, lazy routes) |
| Server state | TanStack Query 5 |
| Forms | React Hook Form + Zod |
| Testing | Vitest + Testing Library |
| CI | GitHub Actions — lint, typecheck, test, build |
| Hosting | Vercel (frontend), Render (API) |

## Project structure

```
src/
  app/            router
  components/
    layout/       navbar, footer, root layout
    ui/           buttons, form fields, dialog, markdown, skeletons…
  features/
    auth/         AuthProvider, useAuth, route guard, auth API
    posts/        query/mutation hooks, post cards
  lib/            API client, token helpers, utils, categories
  routes/         one file per page (lazy-loaded)
  test/           test setup and helpers
```

### Design decisions

- **The post list is the source of truth for reading.** The API's single-post endpoint requires a token, but the public list already returns full posts, so article pages read from the cached list. Readers get instant navigation and never hit a login wall.
- **One auth source.** `AuthProvider` owns the token and the current user; pages call `useAuth()` instead of each re-verifying the token.
- **Filters live in the URL**, not component state — back/forward and shared links just work.

## Getting started

```bash
npm install
cp .env.example .env   # optional: point at a local API
npm run dev            # http://localhost:5173
```

| Script | |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | Unit and component tests |

### Environment

| Variable | Default |
|---|---|
| `VITE_API_URL` | `https://blog-backend-node-7kjl.onrender.com` |

## Deployment

Vercel picks up `vercel.json` (Vite preset, `dist` output, SPA rewrites). Pushing to `master` deploys.

The API runs on Render's free tier, which sleeps when idle — the first request after a quiet spell can take up to a minute. The UI shows skeletons and a retry option while it wakes.

## Known API limitations

These live in the backend repo and are worth fixing there:

- Update/delete endpoints check that you're logged in, not that you **own** the post or profile.
- `GET /getBlog/:id` requires a token even though the list endpoint is public.
- The login response includes the user document (with the password hash).
