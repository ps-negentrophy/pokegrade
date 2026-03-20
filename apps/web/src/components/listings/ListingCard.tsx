"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Eye, Shield } from "lucide-react";
import type { Listing } from "@pokecard/types";
import { formatPrice, getGradeBadgeColor } from "@/data/mockListings";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { card, price, currency, type, seller } = listing;
  const primaryImage = card.images.find((img) => img.isPrimary) ?? card.images[0];
  const gradeBadgeColor = getGradeBadgeColor(card.grading.grader, card.grading.grade);

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div className="bg-white rounded-card shadow-card card-hover overflow-hidden border border-gray-100">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={`${card.name} ${card.set}`}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {card.isFirstEdition && (
              <span className="rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white">
                1st Ed.
              </span>
            )}
            {card.isShadowless && (
              <span className="rounded-full bg-gray-700/80 px-2 py-0.5 text-[10px] font-bold text-white">
                Shadowless
              </span>
            )}
          </div>

          {/* Type badge */}
          {type !== "fixed" && (
            <div className="absolute top-2 right-2">
              <span className="rounded-full bg-gray-800/90 text-white px-2 py-0.5 text-[10px] font-bold uppercase">
                {type}
              </span>
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); }}
            className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-300 shadow hover:text-gray-900 transition"
          >
            <Heart className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          {/* Grade badge */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className={`grade-badge ${gradeBadgeColor}`}>
              {card.grading.grader} {card.grading.grade}
            </span>
            {card.language !== "English" && (
              <span className="grade-badge bg-gray-100 text-gray-600 border border-gray-200">
                {card.language.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">
            {card.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{card.set} · #{card.setNumber}</p>

          {/* Price & meta */}
          <div className="mt-2.5 flex items-end justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900 leading-tight">
                {formatPrice(price, currency)}
              </p>
              {listing.shippingCost === 0 && (
                <p className="text-[10px] text-gray-400 font-medium">Free shipping</p>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-300">
              <Eye className="h-3 w-3" />
              {listing.viewCount.toLocaleString()}
            </div>
          </div>

          {/* Verified seller */}
          {seller.isVerified && (
            <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
              <Shield className="h-3 w-3 text-gray-400" />
              <span>{seller.displayName}</span>
              <span className="font-medium">✓</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
