// ─── Grading ────────────────────────────────────────────────────────────────

export type Grader = "PSA" | "BGS" | "CGC" | "SGC";

export type Grade = 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5 | 5.5 | 6 | 6.5 | 7 | 7.5 | 8 | 8.5 | 9 | 9.5 | 10;

export interface GradeDetails {
  grader: Grader;
  grade: Grade;
  certNumber: string;
  gradedAt?: string;
}

// ─── Card ────────────────────────────────────────────────────────────────────

export interface PokemonCard {
  id: string;
  name: string;
  set: string;
  setNumber: string;       // e.g. "4/102"
  year: number;
  rarity: "Common" | "Uncommon" | "Rare" | "Holo Rare" | "Ultra Rare" | "Secret Rare" | "Promo";
  language: "English" | "Japanese" | "Korean" | "Chinese";
  isFirstEdition: boolean;
  isShadowless: boolean;
  grading: GradeDetails;
  images: CardImage[];
}

export interface CardImage {
  id: string;
  url: string;
  isPrimary: boolean;
  label?: "front" | "back" | "label" | "slab";
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  reputationScore: number;
  totalSales: number;
  totalPurchases: number;
  memberSince: string;
  isVerified: boolean;
}

// ─── Listing ─────────────────────────────────────────────────────────────────

export type ListingType = "fixed" | "auction" | "trade";
export type ListingStatus = "active" | "sold" | "cancelled" | "reserved";
export type Currency = "USD" | "GBP" | "HKD" | "EUR" | "AUD" | "CAD" | "JPY";

export interface Listing {
  id: string;
  card: PokemonCard;
  seller: UserProfile;
  type: ListingType;
  status: ListingStatus;
  price: number;
  currency: Currency;
  shipsTo: string[];         // country codes, e.g. ["US", "GB", "HK"]
  shippingCost?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;        // for auctions
  viewCount: number;
  watchCount: number;
}

// ─── Offer / Bid ─────────────────────────────────────────────────────────────

export type OfferStatus = "pending" | "accepted" | "declined" | "countered" | "expired";

export interface Offer {
  id: string;
  listingId: string;
  buyerId: string;
  amount: number;
  currency: Currency;
  status: OfferStatus;
  message?: string;
  createdAt: string;
  expiresAt: string;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface ListingFilters {
  query?: string;
  sets?: string[];
  graders?: Grader[];
  minGrade?: number;
  maxGrade?: number;
  minPrice?: number;
  maxPrice?: number;
  currency?: Currency;
  type?: ListingType;
  language?: PokemonCard["language"];
  isFirstEdition?: boolean;
  isShadowless?: boolean;
  sortBy?: "price_asc" | "price_desc" | "grade_desc" | "newest" | "popular";
}

// ─── Message / Chat ──────────────────────────────────────────────────────────

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  listingId?: string;
  participantIds: string[];
  lastMessage?: Message;
  updatedAt: string;
}
