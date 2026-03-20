import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Truck, Star, TrendingUp, Zap, Award } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import { mockListings } from "@/data/mockListings";

const STATS = [
  { label: "Cards Listed", value: "24,800+" },
  { label: "Verified Sellers", value: "3,200+" },
  { label: "Countries", value: "48" },
  { label: "Transactions", value: "$12M+" },
];

const TRUST_ITEMS = [
  {
    icon: Shield,
    title: "Authenticity Guaranteed",
    desc: "Every card verified against grading company databases (PSA, BGS, CGC, SGC) before listing goes live.",
  },
  {
    icon: Truck,
    title: "Insured Shipping",
    desc: "Full insurance coverage on every shipment. Cards shipped in tamper-evident, slab-safe packaging.",
  },
  {
    icon: Star,
    title: "Verified Sellers",
    desc: "Sellers are reviewed, rated by buyers, and earn verification badges based on track record.",
  },
];

const TOP_SETS = [
  { name: "Base Set", year: "1998–1999", emoji: "🔥", count: "4,210 listings" },
  { name: "Neo Genesis", year: "2000", emoji: "✨", count: "1,840 listings" },
  { name: "Gym Series", year: "2000–2001", emoji: "🏅", count: "980 listings" },
  { name: "E-Card Series", year: "2002", emoji: "💎", count: "670 listings" },
  { name: "EX Series", year: "2003–2007", emoji: "⚡", count: "2,340 listings" },
  { name: "Japanese Promo", year: "Various", emoji: "🗾", count: "3,100 listings" },
];

export default function HomePage() {
  const featuredListings = mockListings.slice(0, 4);
  const recentListings = mockListings.slice(2, 6);

  return (
    <div className="bg-gray-50">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-brand-blue py-20 sm:py-28">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-brand-yellow blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-brand-red blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm mb-6">
                <Zap className="h-3.5 w-3.5 text-brand-yellow" />
                New listings every day from verified sellers
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                Trade Graded<br />
                <span className="text-brand-yellow">Pokémon Cards</span><br />
                With Confidence
              </h1>

              <p className="mt-6 text-lg text-gray-300 max-w-lg leading-relaxed">
                The world&apos;s most trusted marketplace for PSA, BGS, CGC, and SGC graded Pokémon cards. From Base Set 1st Editions to modern grails.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/listings" className="btn-primary text-base px-7 py-3 shadow-lg">
                  Browse Cards <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/sell" className="btn-secondary text-base px-7 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Sell Your Cards
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — card showcase */}
            <div className="hidden lg:flex justify-center items-center gap-4">
              {mockListings.slice(0, 3).map((listing, i) => (
                <div
                  key={listing.id}
                  className={`w-44 bg-white rounded-xl shadow-2xl overflow-hidden transform ${
                    i === 1 ? "scale-110 z-10" : "scale-95 opacity-80"
                  }`}
                  style={{ rotate: `${(i - 1) * 8}deg` }}
                >
                  <div className="relative aspect-[3/4] bg-gray-100">
                    <Image
                      src={listing.card.images[0].url}
                      alt={listing.card.name}
                      fill
                      className="object-contain p-2"
                      sizes="176px"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-xs font-bold text-gray-900 truncate">{listing.card.name}</p>
                    <p className="text-[10px] text-brand-red font-bold mt-0.5">
                      {listing.card.grading.grader} {listing.card.grading.grade}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Listings ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5 text-brand-red" />
              <span className="text-sm font-semibold text-brand-red uppercase tracking-wide">Featured</span>
            </div>
            <h2 className="section-title">High-Value Listings</h2>
          </div>
          <Link href="/listings" className="btn-secondary hidden sm:inline-flex">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* ── Top Sets ───────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-brand-red" />
            <span className="text-sm font-semibold text-brand-red uppercase tracking-wide">Collections</span>
          </div>
          <h2 className="section-title mb-8">Browse by Set</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {TOP_SETS.map((s) => (
              <Link
                key={s.name}
                href={`/listings?set=${encodeURIComponent(s.name)}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center hover:border-brand-red hover:shadow-card transition group"
              >
                <span className="text-3xl">{s.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-red transition">{s.name}</p>
                  <p className="text-[10px] text-gray-500">{s.year}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Listings ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-5 w-5 text-brand-red" />
              <span className="text-sm font-semibold text-brand-red uppercase tracking-wide">Just Listed</span>
            </div>
            <h2 className="section-title">Recently Added</h2>
          </div>
          <Link href="/listings?sort=newest" className="btn-secondary hidden sm:inline-flex">
            See More <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {recentListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* ── Trust Section ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white">Why Collectors Trust PokeGrade</h2>
            <p className="mt-3 text-gray-400 max-w-xl mx-auto">
              We built every feature to protect buyers and reward honest sellers.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red/20 mb-4">
                  <item.icon className="h-6 w-6 text-brand-red" />
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/sell" className="btn-primary text-base px-8 py-3">
              Start Selling Today <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
