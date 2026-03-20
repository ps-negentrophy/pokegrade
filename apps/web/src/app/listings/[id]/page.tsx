import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Shield, Truck, Star, Eye, Heart, ExternalLink,
  MapPin, CheckCircle, ArrowLeft, MessageCircle, Share2
} from "lucide-react";
import { mockListings, formatPrice, getGradeBadgeColor } from "@/data/mockListings";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = mockListings.find((l) => l.id === params.id);
  if (!listing) return { title: "Listing Not Found" };
  return {
    title: `${listing.card.name} ${listing.card.grading.grader} ${listing.card.grading.grade} — ${listing.card.set}`,
    description: listing.description,
  };
}

export default function ListingDetailPage({ params }: Props) {
  const listing = mockListings.find((l) => l.id === params.id);
  if (!listing) notFound();

  const { card, seller, price, currency, type } = listing;
  const gradeBadgeColor = getGradeBadgeColor(card.grading.grader, card.grading.grade);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-red transition">Home</Link>
        <span>/</span>
        <Link href="/listings" className="hover:text-brand-red transition">Browse</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{card.name} {card.grading.grader} {card.grading.grade}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left: Images */}
        <div>
          {/* Primary image */}
          <div className="relative aspect-[3/4] max-w-sm mx-auto bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-card">
            <Image
              src={card.images[0].url}
              alt={`${card.name} front`}
              fill
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {type !== "fixed" && (
              <div className={`absolute top-4 left-4 rounded-full px-3 py-1 text-sm font-bold text-white uppercase shadow-lg ${
                type === "auction" ? "bg-orange-500" : "bg-green-600"
              }`}>
                {type}
              </div>
            )}
          </div>

          {/* Thumb strip (placeholder additional angles) */}
          <div className="mt-4 flex gap-2 justify-center">
            {["front", "back", "label", "slab"].map((angle) => (
              <button
                key={angle}
                className="relative w-16 aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-brand-red transition bg-gray-50"
              >
                <Image
                  src={card.images[0].url}
                  alt={angle}
                  fill
                  className="object-contain p-1 opacity-70"
                  sizes="64px"
                />
                <span className="absolute bottom-0 inset-x-0 text-[8px] text-center bg-black/50 text-white capitalize py-0.5">{angle}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div>
          {/* Title */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`grade-badge text-sm ${gradeBadgeColor}`}>
                  {card.grading.grader} {card.grading.grade}
                </span>
                {card.isFirstEdition && (
                  <span className="grade-badge bg-black text-white text-sm">1st Edition</span>
                )}
                {card.isShadowless && (
                  <span className="grade-badge bg-purple-100 text-purple-800 border border-purple-300 text-sm">Shadowless</span>
                )}
              </div>

              <h1 className="text-3xl font-black text-gray-900">{card.name}</h1>
              <p className="text-gray-500 mt-1">{card.set} · #{card.setNumber} · {card.year}</p>
            </div>

            <div className="flex gap-2 shrink-0">
              <button className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-brand-red hover:border-brand-red transition">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 transition">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-gray-900">{formatPrice(price, currency)}</span>
              {type === "auction" && <span className="text-sm text-orange-600 font-medium">Current bid</span>}
            </div>
            {listing.shippingCost === 0 ? (
              <p className="text-sm text-green-600 font-medium mt-1 flex items-center gap-1">
                <Truck className="h-4 w-4" /> Free insured shipping
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">
                + {formatPrice(listing.shippingCost ?? 0, currency)} shipping
              </p>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-col gap-3">
              {type === "fixed" && (
                <button className="btn-primary w-full text-base py-3">Buy Now</button>
              )}
              {type === "auction" && (
                <button className="btn-primary w-full text-base py-3">Place Bid</button>
              )}
              <button className="btn-outline-red w-full text-base py-3">
                {type === "trade" ? "Propose a Trade" : "Make an Offer"}
              </button>
              <button className="btn-secondary w-full text-base py-3 gap-2">
                <MessageCircle className="h-4 w-4" /> Message Seller
              </button>
            </div>
          </div>

          {/* Grading info */}
          <div className="mt-6">
            <h3 className="font-bold text-gray-900 mb-3">Grading Details</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Grading Company", value: card.grading.grader },
                { label: "Grade", value: card.grading.grade.toString() },
                { label: "Cert Number", value: card.grading.certNumber },
                { label: "Graded", value: card.grading.gradedAt ? new Date(card.grading.gradedAt).getFullYear().toString() : "—" },
              ].map((row) => (
                <div key={row.label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{row.label}</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{row.value}</p>
                </div>
              ))}
            </div>
            <a
              href={`https://www.psacard.com/cert/${card.grading.certNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand-blue hover:underline font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              Verify cert on {card.grading.grader}&apos;s website
            </a>
          </div>

          {/* Card details */}
          <div className="mt-6">
            <h3 className="font-bold text-gray-900 mb-3">Card Details</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Rarity", value: card.rarity },
                { label: "Language", value: card.language },
                { label: "Year", value: card.year.toString() },
                { label: "Set Number", value: `#${card.setNumber}` },
              ].map((row) => (
                <div key={row.label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{row.label}</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Seller&apos;s Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
            </div>
          )}

          {/* Seller card */}
          <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200 shadow-card">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Sold by</h3>
            <Link href={`/profile/${seller.username}`} className="flex items-center gap-3 hover:opacity-80 transition">
              <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                <Image
                  src={seller.avatarUrl ?? `https://api.dicebear.com/8.x/avataaars/svg?seed=${seller.username}`}
                  alt={seller.displayName}
                  width={48}
                  height={48}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900 truncate">{seller.displayName}</span>
                  {seller.isVerified && <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    {seller.reputationScore} ({seller.totalSales} sales)
                  </span>
                  {seller.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {seller.location}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Shipping destinations */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" />
              Ships to: {listing.shipsTo.join(" · ")}
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              { icon: Shield, text: "Buyer Protection" },
              { icon: CheckCircle, text: "Cert Verified" },
              { icon: Truck, text: "Tracked Shipping" },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-200">
                <badge.icon className="h-3.5 w-3.5 text-brand-red" />
                {badge.text}
              </div>
            ))}
          </div>

          {/* View count */}
          <p className="mt-4 text-xs text-gray-400 flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {listing.viewCount.toLocaleString()} views · {listing.watchCount} watching
          </p>
        </div>
      </div>

      {/* Back link */}
      <div className="mt-12">
        <Link href="/listings" className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Browse
        </Link>
      </div>
    </div>
  );
}
