"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, ShoppingBag, Heart, MessageCircle, Bell, User } from "lucide-react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-gray-900 text-white text-xs text-center py-1.5 font-medium tracking-wide">
        Free insured shipping on orders over $500 · Authenticity guaranteed on every listing
      </div>

      {/* Main nav */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="relative flex h-9 w-9 items-center justify-center shrink-0">
              <span className="text-[32px] text-black leading-none select-none">♣</span>
              <span className="absolute text-white font-black text-[11px] leading-none mt-0.5">✕</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-black text-gray-900 leading-none">Ten</span>
              <span className="text-xl font-black text-gray-500 leading-none">Only</span>
            </div>
          </Link>

          {/* Search */}
          <div className="relative flex-1 max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search cards, sets, grades..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-sm focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition"
            />
          </div>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/listings" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition rounded-lg hover:bg-gray-50">
              Browse
            </Link>
            <Link href="/sell" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition rounded-lg hover:bg-gray-50">
              Sell
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button className="hidden sm:flex p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition relative">
              <Heart className="h-5 w-5" />
            </button>
            <button className="hidden sm:flex p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition">
              <MessageCircle className="h-5 w-5" />
            </button>
            <button className="hidden sm:flex p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gray-900" />
            </button>

            <Link href="/auth" className="btn-primary hidden sm:inline-flex ml-2 py-2">
              Sign In
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className="hidden lg:flex items-center gap-2 pb-3 overflow-x-auto">
          {["All", "PSA 10", "BGS 9.5", "1st Edition", "Shadowless", "Japanese", "Neo Genesis", "Gym Series", "E-Card"].map((cat) => (
            <Link
              key={cat}
              href={`/listings?category=${cat}`}
              className="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 hover:border-gray-900 hover:text-gray-900 transition bg-white"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
          <Link href="/listings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <ShoppingBag className="h-4 w-4" /> Browse Listings
          </Link>
          <Link href="/sell" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <ShoppingBag className="h-4 w-4" /> Sell a Card
          </Link>
          <Link href="/profile/me" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <User className="h-4 w-4" /> Profile
          </Link>
          <div className="pt-2">
            <Link href="/auth" onClick={() => setMenuOpen(false)} className="btn-primary w-full">
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
