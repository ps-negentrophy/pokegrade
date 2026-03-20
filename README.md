# PokeGrade — Graded Pokémon Card Marketplace

A cross-platform marketplace for buying, selling, and trading authenticated graded Pokémon cards.
Supports **Web** (Next.js), **iOS**, and **Android** (Expo) from a single monorepo.

---

## Tech Stack

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Web         | Next.js 14 (App Router) + Tailwind CSS  |
| Mobile      | Expo SDK 51 + Expo Router + NativeWind  |
| Types       | Shared TypeScript (`@pokecard/types`)   |
| Backend     | Supabase (auth + Postgres + Storage)    |
| Monorepo    | Turborepo                              |

---

## Project Structure

```
pokecard-market/
├── apps/
│   ├── web/          # Next.js 14 website
│   └── mobile/       # Expo iOS + Android app
├── packages/
│   ├── types/        # Shared TypeScript interfaces
│   └── supabase/     # Shared Supabase client & queries
├── turbo.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 10+
- For mobile: Expo CLI (`npm install -g expo-cli`)
- For iOS: Xcode + iOS Simulator (macOS only)
- For Android: Android Studio + Emulator

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

**Web** (`apps/web/.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Mobile** (`apps/mobile/.env`):
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run the web app

```bash
# From the root:
npm run dev

# Or directly:
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Run the mobile app

```bash
cd apps/mobile
npx expo start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser
- Scan QR code with Expo Go on your phone

---

## Supabase Setup

Create the following tables in your Supabase project:

```sql
-- Profiles (extends auth.users)
create table profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  location text,
  reputation_score numeric default 5.0,
  total_sales int default 0,
  total_purchases int default 0,
  is_verified boolean default false,
  created_at timestamptz default now()
);

-- Cards
create table cards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  set_name text not null,
  set_number text,
  year int,
  rarity text,
  language text default 'English',
  is_first_edition boolean default false,
  is_shadowless boolean default false
);

-- Card gradings
create table card_gradings (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references cards,
  grader text not null,  -- PSA, BGS, CGC, SGC
  grade numeric not null,
  cert_number text unique not null,
  graded_at date
);

-- Card images
create table card_images (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references cards,
  storage_path text not null,
  is_primary boolean default false,
  label text  -- front, back, label, slab
);

-- Listings
create table listings (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references cards,
  seller_id uuid references profiles,
  type text not null,    -- fixed, auction, trade
  status text default 'active',
  price numeric not null,
  currency text default 'USD',
  shipping_cost numeric default 0,
  ships_to text[],
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  expires_at timestamptz,
  view_count int default 0,
  watch_count int default 0
);

-- Offers
create table offers (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings,
  buyer_id uuid references profiles,
  amount numeric not null,
  currency text default 'USD',
  status text default 'pending',
  message text,
  created_at timestamptz default now(),
  expires_at timestamptz
);
```

Create a **Storage bucket** named `card-images` with public access.

---

## Pages & Screens

### Web (Next.js)
| Route | Description |
|-------|-------------|
| `/` | Home — hero, featured listings, browse by set |
| `/listings` | Browse all with filters (grader, grade, price, set, type) |
| `/listings/[id]` | Card detail — images, grading info, buy/offer/trade |
| `/sell` | Multi-step listing wizard (photos → card info → grading → pricing) |
| `/profile/[username]` | Seller profile with listings and stats |
| `/auth` | Sign in / Sign up with email or Google |

### Mobile (Expo)
| Screen | Description |
|--------|-------------|
| Browse (tab) | Card grid with search and filter chips |
| Sell (tab) | Step-by-step listing with camera/library upload |
| Messages (tab) | Buyer–seller conversations |
| Profile (tab) | User stats, listings, account menu |
| Listing Detail | Full card info, buy/offer CTAs |
| Auth (modal) | Sign in / Sign up |

---

## Image Upload Flow

1. User selects/takes a photo in the Sell flow
2. Image is uploaded to **Supabase Storage** (`card-images/{listingId}/{filename}`)
3. Public URL is returned and stored in `card_images` table
4. URL is served via `<Image>` in Next.js / `<Image>` in React Native

---

## Roadmap

- [ ] Connect Supabase auth (email + Google OAuth)
- [ ] Real-time offers/messages via Supabase Realtime
- [ ] PSA/BGS cert verification API integration
- [ ] Push notifications (Expo Notifications)
- [ ] Stripe payment processing
- [ ] Price history charts per card
- [ ] Admin moderation dashboard
