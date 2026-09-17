# WiszMe ✨

One place. Every special moment.

## What this is

WiszMe is the central hub connecting four existing products —
**BirthzMe**, **UzMe**, **DatezMe**, **FeztMe** — plus two brand-new
WiszMe-native experiences: **Good Morning** and **Good Night**.

It does **not** re-implement Birthday, Anniversary, Valentine, Special
Date, Just Because, Date Invitation, New Year or Christmas — those
already exist as real, live, working products. Re-building them inside
WiszMe would mean maintaining two copies of the same product forever.
Instead, WiszMe:

1. Helps a visitor figure out **which product** they need for their
   occasion (the category finder), grouped by Celebrate / Love /
   Invitations / Holidays / Everyday.
2. Shows a **short interactive teaser** of that category's vibe (built
   natively in WiszMe — a balloon that pops, a heart that unlocks, a
   yes/no date card, a countdown+fireworks burst) so the visitor knows
   what they're about to create.
3. Sends them to the **real product** to actually create it
   (`birthzme.vercel.app`, `uzme.vercel.app`, etc., opened in a new tab).
4. For **Good Morning** and **Good Night** — categories that don't
   belong to any existing product — WiszMe is the actual product: a
   full creation wizard, real Supabase-backed link generation, and a
   real animated recipient experience, all built here.

## Why this architecture (not an iframe / full clone)

I don't have access to the other four products' source code, so
re-rendering their *actual* templates inside WiszMe isn't possible
without guessing at (and likely misrepresenting) their real
experience. The honest, buildable alternative: WiszMe builds its own
short teaser in its own visual language for each category, then hands
off to the real product's own creator — which is also the more
maintainable long-term architecture, since each product keeps
evolving its own templates independently without WiszMe needing to
track every change.

Adding a fifth product later, or moving a category between products,
is a one-line edit in `lib/categories.ts` — nothing else in the
codebase needs to change.

## What's built and real here

- Config-driven category to product routing (`lib/categories.ts`) —
  the single source of truth for every category card, its teaser, its
  group, and where "Create" sends the visitor
- Landing page: hero, product showcase, how-it-works, category finder
- Interactive teaser animations for all 4 external products' categories
  (tap to see the interaction: balloon pop, heart unlock, date
  yes/no, countdown+fireworks) — genuinely interactive, not GIFs
- Good Morning, Good Night, Mother's Day, Father's Day, Wedding, New
  Baby, Get Well Soon, Good Luck, Housewarming, Diwali, and Sinhala &
  Tamil New Year — **11 fully real WiszMe-native experiences**, each with:
  - Magic-link auth (Suspense-wrapped), protected /create and /dashboard
  - 5-step creation wizard with live preview using the actual recipient template
  - Real ImageKit photo upload
  - Real Supabase Postgres with RLS (supabase/schema.sql)
  - Real slug-based public links (one route per category, e.g. /diwali/[slug])
  - Its own themed scene interaction: sunrise, night sky, tap-to-bloom
    bouquet, tap-to-open medal, rings joining, gift-to-baby reveal,
    tap-to-light oil lamps
  - Typewriter message reveal, memory slideshow, music player
  - Dashboard: list, copy link, share, delete
  - QR, WhatsApp, and native Web Share on the success screen
  - Free/Pro plan modal with real PayHere checkout + server-verified
    webhook (never trusts a client-side "payment succeeded" callback)
  No category is left in a disabled "Coming Soon" state — everything
  shown in the finder is clickable and creates a real link.
- Signature gift-box hero interaction — tap the glowing gift on the
  landing page and category icons burst out in orbit, each linking
  straight to that category's create flow
- Cinematic hero background — a looping day-to-night sky cycle (sun
  rises, arcs overhead, sets, stars come out, moon rises, loops back to
  dawn), plus ambient balloons rising and hearts falling
- A "Product Showcase Reel" — a slow, auto-advancing cinematic strip
  cycling through a one-line vignette for every connected product
  (Birthday/Romance/Date/Holiday/Good Morning/Good Night), standing in
  for "a short movie of everything WiszMe connects to"
- Site-wide navigation bar with a "Create" mega-menu (grouped by
  Celebrate/Love/Invitations/Holidays/Everyday, pulled live from
  lib/categories.ts) and a mobile menu — hidden on the immersive
  recipient pages, same as every other product in this ecosystem
- "Help Me Choose" — a 3-question recommendation wizard (Who is this
  for? / What feeling? / What are you trying to say?) that suggests
  the right category and links straight to creating it
- Basic PWA — manifest, offline shell, install prompt (Android native
  prompt, iOS manual instructions)
- Lessons learned from BirthzMe/UsMe/DatezMe/FeztMe applied from the
  start: postcss.config.js/tailwind.config.js as plain .js,
  useSearchParams() wrapped in Suspense, AnimatePresence never uses
  mode="wait" (documented source of scenes permanently failing to
  render after a state-batched action), SceneErrorBoundary around
  every template as a fallback.

## Not included (explicitly out of scope for this MVP)

- Icons/favicon are NOT generated — manifest.json and layout.tsx
  reference /icons/icon-192.png, icon-512.png, icon-maskable-512.png,
  and /favicon.ico, but these image files don't exist yet. Send a logo
  and they can be generated.
- npm install / npm run build has NOT been run or verified in this
  environment (no network access here) — only manual brace-balance and
  structural checks were done. Run the build yourself and report any
  TypeScript errors.
- Re-implementing Birthday/Romantic/Date/Holiday templates inside
  WiszMe (see "Why this architecture" above)
- AI message generation - the "style" buttons in the message step are
  local deterministic presets, not a live AI call
- Edit-wish UI (the PATCH /api/wishes/[id] route exists; no wizard
  screen calls it yet)
- Real hosted music files - lib/message-presets.ts has placeholder
  /audio/*.mp3 paths
- Explore page with filters/search (the landing page's category finder
  covers browsing; a dedicated /explore page with mood/interaction
  filters is a natural next addition)
- Automated tests

## Project structure

```
app/
  page.tsx                          landing page (category finder)
  layout.tsx, globals.css
  auth/login/page.tsx               magic-link sign-in (Suspense-wrapped)
  auth/callback/route.ts
  create/[category]/page.tsx        native -> wizard, external -> "Create on X"
  create/success/page.tsx
  dashboard/page.tsx                Good Morning/Good Night wishes only
  good-morning/[slug]/page.tsx      public recipient experience
  good-night/[slug]/page.tsx
  api/upload/route.ts
  api/wishes/route.ts               POST create
  api/wishes/[id]/route.ts          PATCH / DELETE
  api/events/route.ts
components/
  animations/
    Sunrise.tsx, NightSky.tsx       Good Morning / Good Night scene backgrounds
    LetterReveal.tsx, TypewriterMessage.tsx, MemorySlideshow.tsx, MusicPlayer.tsx
    CategoryTeasers.tsx             interactive mini-previews for every external category
  templates/
    GoodMorningTemplate.tsx, GoodNightTemplate.tsx
  create/WiszWizard.tsx             the one wizard for both native categories
  dashboard/                        WishCard, SignOutButton
  marketing/LandingPage.tsx, CategoryCard.tsx
  shared/                           ShareButtons, Watermark, SceneErrorBoundary, WishEventTracker, trackEvent
lib/
  categories.ts                     THE config: category -> product -> route/teaser mapping
  supabase/client.ts, server.ts
  slug.ts, imagekit.ts, upload.ts
  wishes.ts                         getWishBySlug() shared by both public routes
  message-presets.ts
middleware.ts                       protects /dashboard, /create/good-morning, /create/good-night
types/wisz.ts
supabase/schema.sql
```

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill in your Supabase and ImageKit values in .env.local before running.

## Supabase setup

1. Create a new Supabase project (independent from BirthzMe/UsMe/
   DatezMe/FeztMe's projects).
2. Run supabase/schema.sql in the SQL editor.
3. Copy your Project URL, anon key, and service role key into .env.local.
4. Sign in at /auth/login, then use the category finder, choose Good
   Morning or Good Night, and the real wizard opens.

## How to add a new category

Open lib/categories.ts and add one entry to the CATEGORIES array with
a slug, name, emoji, description, group, product, externalUrl (omit
for native categories), and teaser. The landing page, category finder,
and /create/[category] route all pick it up automatically for an
external category. For a new native category, also add a template
component (mirroring GoodMorningTemplate.tsx), a public route, and
extend WiszWizard.tsx and the wisz_wishes check constraints in
schema.sql.

## PayHere setup

Get your Merchant ID (numeric) and Merchant Secret from your PayHere
sandbox/live dashboard's Integrations page (not the API Keys App
ID/Secret — different credential system). Add both to .env.local.
sandbox: true is hardcoded in PlanSelectModal.tsx for testing — flip
to false once you have live credentials. PayHere rejects *.vercel.app
subdomains as a registered domain, so you'll need a custom domain
before testing checkout end-to-end in production.

## Known first-run pitfalls already avoided

- postcss.config.js and tailwind.config.js are plain .js, not .ts
- Login page's useSearchParams() is wrapped in Suspense
- AnimatePresence never uses mode="wait" - every template's scene
  wrapper uses absolute positioning for a clean crossfade instead
- Any canvas-based animation with a trigger prop should sit outside
  any conditionally rendered scene block, or it unmounts along with
  that scene and stops responding to its trigger

## Troubleshooting

- Blank page at a wish link: check the wish's status is published,
  opened, or completed; RLS hides draft rows on purpose.
- "Create on BirthzMe/UzMe/DatezMe/FeztMe" opens the wrong page: the
  URLs in lib/categories.ts point at each product's live homepage, not
  a specific category page - update them there if that changes.
- Music won't play on first load: expected, the floating music button
  requires one tap due to mobile autoplay restrictions.
