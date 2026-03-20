"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown, X, Search } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import { mockListings } from "@/data/mockListings";
import type { Grader } from "@pokecard/types";

const GRADERS: Grader[] = ["PSA", "BGS", "CGC", "SGC"];
const SETS = ["Base Set", "Neo Genesis", "Gym Series", "E-Card Series", "EX Series", "Japanese Promo"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "grade_desc", label: "Grade: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export default function ListingsPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedGraders, setSelectedGraders] = useState<Grader[]>([]);
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [minGrade, setMinGrade] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [listingType, setListingType] = useState<string>("all");
  const [sortBy, setSortBy] = useState("newest");
  const [firstEdOnly, setFirstEdOnly] = useState(false);
  const [query, setQuery] = useState("");

  const toggleGrader = (g: Grader) =>
    setSelectedGraders((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);

  const toggleSet = (s: string) =>
    setSelectedSets((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const activeFilterCount =
    selectedGraders.length +
    selectedSets.length +
    (minGrade ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (listingType !== "all" ? 1 : 0) +
    (firstEdOnly ? 1 : 0);

  const clearFilters = () => {
    setSelectedGraders([]);
    setSelectedSets([]);
    setMinGrade("");
    setMinPrice("");
    setMaxPrice("");
    setListingType("all");
    setFirstEdOnly(false);
  };

  const filtered = mockListings.filter((l) => {
    if (query && !l.card.name.toLowerCase().includes(query.toLowerCase()) && !l.card.set.toLowerCase().includes(query.toLowerCase())) return false;
    if (selectedGraders.length && !selectedGraders.includes(l.card.grading.grader)) return false;
    if (selectedSets.length && !selectedSets.includes(l.card.set)) return false;
    if (minGrade && l.card.grading.grade < parseFloat(minGrade)) return false;
    if (minPrice && l.price < parseFloat(minPrice)) return false;
    if (maxPrice && l.price > parseFloat(maxPrice)) return false;
    if (listingType !== "all" && l.type !== listingType) return false;
    if (firstEdOnly && !l.card.isFirstEdition) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Browse Listings</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} cards found</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="btn-secondary gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-white text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-base pr-8 appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by card name or set..."
          className="input-base pl-11"
        />
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters (desktop) */}
        <aside className={`shrink-0 w-64 space-y-6 ${filtersOpen ? "block" : "hidden"} lg:block`}>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Filters</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-brand-red hover:underline flex items-center gap-1">
                  <X className="h-3 w-3" /> Clear all
                </button>
              )}
            </div>

            {/* Grader */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Grading Company</p>
              <div className="space-y-2">
                {GRADERS.map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGraders.includes(g)}
                      onChange={() => toggleGrader(g)}
                      className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
                    />
                    <span className="text-sm text-gray-700">{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Set */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Set</p>
              <div className="space-y-2">
                {SETS.map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSets.includes(s)}
                      onChange={() => toggleSet(s)}
                      className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
                    />
                    <span className="text-sm text-gray-700">{s}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Listing type */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Listing Type</p>
              <div className="flex gap-2 flex-wrap">
                {["all", "fixed", "auction", "trade"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setListingType(t)}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
                      listingType === t
                        ? "bg-brand-red text-white border-brand-red"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Min Grade</p>
              <input
                type="number"
                min={1}
                max={10}
                step={0.5}
                value={minGrade}
                onChange={(e) => setMinGrade(e.target.value)}
                placeholder="e.g. 9"
                className="input-base"
              />
            </div>

            {/* Price */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Price (USD)</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  className="input-base"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="input-base"
                />
              </div>
            </div>

            {/* 1st Ed */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={firstEdOnly}
                onChange={(e) => setFirstEdOnly(e.target.checked)}
                className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
              />
              <span className="text-sm text-gray-700 font-medium">1st Edition only</span>
            </label>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-500 text-sm max-w-xs">Try adjusting your filters or search query.</p>
              <button onClick={clearFilters} className="btn-primary mt-6">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
