import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Star, Shield, MapPin, Package, ShoppingCart, Calendar, CheckCircle, ExternalLink } from "lucide-react";
import { mockSellers, mockListings } from "@/data/mockListings";
import { ListingCard } from "@/components/listings/ListingCard";

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seller = mockSellers.find((s) => s.username === params.username);
  if (!seller) return { title: "User Not Found" };
  return { title: `${seller.displayName} (@${seller.username})` };
}

export default function ProfilePage({ params }: Props) {
  const seller = mockSellers.find((s) => s.username === params.username) ?? mockSellers[0];
  if (!seller) notFound();

  const sellerListings = mockListings.filter((l) => l.seller.id === seller.id);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
        {/* Banner */}
        <div className="h-32 bg-black" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="relative h-24 w-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gray-100">
              <Image
                src={seller.avatarUrl ?? `https://api.dicebear.com/8.x/avataaars/svg?seed=${seller.username}`}
                alt={seller.displayName}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="flex gap-2 mt-14">
              <button className="btn-secondary text-sm">Message</button>
              <button className="btn-secondary text-sm">Follow</button>
            </div>
          </div>

          {/* Name & info */}
          <div className="flex flex-wrap items-start gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900">{seller.displayName}</h1>
                {seller.isVerified && (
                  <CheckCircle className="h-6 w-6 text-gray-500" />
                )}
              </div>
              <p className="text-gray-400 text-sm">@{seller.username}</p>
            </div>
          </div>

          {seller.bio && (
            <p className="mt-3 text-gray-600 text-sm max-w-xl leading-relaxed">{seller.bio}</p>
          )}

          {/* Meta */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
            {seller.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {seller.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Member since {new Date(seller.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Star, label: "Reputation", value: seller.reputationScore.toString(), sub: "out of 5.0" },
              { icon: Package, label: "Total Sales", value: seller.totalSales.toString(), sub: "completed" },
              { icon: ShoppingCart, label: "Purchases", value: seller.totalPurchases.toString(), sub: "orders placed" },
              { icon: Shield, label: "Status", value: seller.isVerified ? "Verified" : "Standard", sub: "seller tier" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-center">
                <stat.icon className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                <p className="text-xl font-black text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                <p className="text-[10px] text-gray-300">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-8">
        {["Active Listings", "Sold", "Feedback"].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              i === 0
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {tab}
            {i === 0 && sellerListings.length > 0 && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {sellerListings.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Listings grid */}
      {sellerListings.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sellerListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-3 grayscale">📭</p>
          <p className="text-gray-400">No active listings</p>
        </div>
      )}

      {sellerListings.length === 0 && (
        <div className="mt-6 text-center">
          <Link href="/listings" className="btn-secondary">
            Browse All Listings <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
