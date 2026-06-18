# NARA Real Estate — London estate-agency platform

A production-shaped, multi-listing estate-agency platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma** and **PostgreSQL**. It is designed to scale to hundreds or thousands of listings, with a public site, an admin CMS, a REST API and a reusable property-detail template.

The first live listing is a **one-bedroom apartment on Cable Street, London E1 (£285,000 sale price)** with a private roof terrace, seeded alongside five more properties so search, filtering and the map are populated out of the box.

> **Brand note.** "NARA Real Estate" is the production brand. Everything user-facing (name, tagline, contact details, navigation) lives in `src/lib/site.ts` — change it there and it updates across the whole site.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, `src/` dir, React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + a small design-token system |
| Animation | Framer Motion |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Custom JWT sessions (`jose`) + `bcryptjs`, httpOnly cookie, edge middleware |
| Maps | Leaflet (vanilla, dynamically imported) + OpenStreetMap tiles |
| Validation | Zod |
| Hosting | Vercel (frontend) + any managed Postgres (Neon, Supabase, Railway…) |

---

## Quick start

### Prerequisites
- Node.js 18.18+ (or 20+)
- A PostgreSQL database (local, or a free Neon / Supabase instance)

### 1. Install
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Then edit `.env`:
- `DATABASE_URL` — your PostgreSQL connection string
- `SESSION_SECRET` — a long random string (`openssl rand -base64 48`)
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` in development
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the admin account the seed will create

### 3. Create the schema and seed data
```bash
npm run db:push      # or: npm run db:migrate  (to create a migration)
npm run db:seed      # creates the admin user, agents, areas and 6 listings
```

### 4. Run
```bash
npm run dev
```
Open <http://localhost:3000>. The admin dashboard is at <http://localhost:3000/admin>.

**Default admin login** (from `.env`): `admin@nara.london` / `nara-admin`

### Useful scripts
```bash
npm run dev        # start the dev server
npm run build      # prisma generate + next build
npm run start      # run the production build
npm run db:studio  # open Prisma Studio to browse data
npm run db:reset   # drop, recreate and reseed the database
```

---

## Project structure

```
nara-real-estate/
├── prisma/
│   ├── schema.prisma        # full data model (12 models + enums)
│   └── seed.ts              # admin, agents, locations, area guide, blog, 6 listings
├── public/
│   ├── brand/               # favicon, default OG image
│   └── properties/…/        # listing photography + floorplan
└── src/
    ├── middleware.ts        # protects /admin via session cookie (edge)
    ├── app/
    │   ├── layout.tsx       # root: fonts, metadata, org JSON-LD
    │   ├── globals.css      # design tokens + base styles
    │   ├── sitemap.ts       # dynamic sitemap
    │   ├── robots.ts
    │   ├── (site)/          # public site (own header/footer layout)
    │   │   ├── page.tsx                    # homepage
    │   │   ├── properties/                 # search results + [slug] detail template
    │   │   ├── map/                         # map search
    │   │   ├── areas/                       # area guides index + [slug]
    │   │   ├── about / sell / lettings / valuation / contact
    │   │   ├── insights/                    # blog index + [slug]
    │   │   └── saved/                       # client-side saved properties
    │   ├── admin/           # dashboard, login, property CRUD, enquiries
    │   └── api/             # REST endpoints (see below)
    ├── components/          # ui / layout / property / home / admin
    └── lib/                 # data access, auth, seo, formatting, validation
```

---

## REST API

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/properties` | public | Filtered listing search (also `?slugs=a,b,c` for saved) |
| `POST` | `/api/properties` | admin | Create a listing |
| `GET` | `/api/properties/:id` | public | Fetch one listing |
| `PUT` | `/api/properties/:id` | admin | Update a listing |
| `DELETE` | `/api/properties/:id` | admin | Delete a listing |
| `POST` | `/api/enquiries` | public | Submit an enquiry / viewing request |
| `GET` | `/api/enquiries` | admin | List enquiries |
| `PATCH` | `/api/enquiries/:id` | admin | Update enquiry status |
| `POST` | `/api/valuation` | public | Submit a valuation request |
| `POST` | `/api/auth/login` | public | Sign in (sets session cookie) |
| `POST` | `/api/auth/logout` | — | Sign out |

Search query parameters: `transaction`, `type`, `minPrice`, `maxPrice`, `minBeds`, `maxBeds`, `minBaths`, `tenure`, `location`, `outdoor`, `parking`, `chainFree`, `q`, `lat`/`lng`/`radius`, `sort`, `page`.

---

## How this maps to the brief

1. **Frontend architecture** — App Router, `src/` layout, route groups, server + client components.
2. **Backend architecture** — Prisma data layer, REST route handlers, session auth, middleware.
3. **Database schema** — `prisma/schema.prisma`.
4. **API structure** — table above.
5. **Admin dashboard** — `/admin` (stats, property CRUD, enquiry management).
6. **Property search** — server-rendered filtering + map search.
7. **Property detail page** — reusable template at `properties/[slug]` (gallery, EPC, map, mortgage, enquiry, related, agent, JSON-LD).
8. **Homepage** — hero search, featured listings, services, area guides, CTA.
9. **Reusable components** — `src/components`.
10. **Production folder structure** — see above.
11. **Authentication system** — JWT sessions + bcrypt + edge middleware.
12. **UI design system** — tokens in `globals.css`, primitives in `components/ui`.

---

## Deployment (Vercel + managed Postgres)

1. Push this folder to a Git repository.
2. Create a Postgres database (e.g. **Neon** or **Supabase**) and copy its connection string.
3. Import the repo into **Vercel**.
4. Add environment variables in Vercel: `DATABASE_URL`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL` (your production URL), `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
5. Run migrations and seed against the production database, e.g. locally with the production `DATABASE_URL`:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
6. Deploy. The `build` script runs `prisma generate` automatically.

---

## Extending the platform

The core journeys are complete and runnable: **browse → search/filter → property detail → enquiry**, **map search**, and **admin sign-in → create/edit/delete listings → manage enquiries**. Natural next steps:

- **Direct media uploads.** The admin form references media already in `/public`. Wire **Vercel Blob** or **S3** to upload photos, floorplans, EPCs and brochures (the `PropertyImage` and `PropertyDocument` models already support this).
- **Buyer accounts.** The `User`, `SavedProperty`, `SavedSearch` and `PropertyAlert` models are in place; saved properties currently use `localStorage` for a no-login experience. Add account auth to persist them server-side.
- **Property alerts.** Add a scheduled job (Vercel Cron) to email matches for saved searches.
- **ISR.** Data pages use `force-dynamic` so the app runs without a build-time database. Swap to `revalidate`-based ISR for cached, fast property pages once a database is connected at build.
- **Agents & content CMS.** Agents, area guides and blog posts have models and public pages; add admin screens to manage them as you did for properties.

---

## License / usage

Production build. Imagery is illustrative. Replace the placeholder brand, copy and photography before any real-world use.
