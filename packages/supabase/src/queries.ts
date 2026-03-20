import { supabase } from "./client";
import type { Listing, ListingFilters, Offer, UserProfile } from "@pokecard/types";

// ─── Listings ────────────────────────────────────────────────────────────────

export async function getListings(filters?: ListingFilters): Promise<Listing[]> {
  let query = supabase
    .from("listings")
    .select(`
      *,
      card:cards(*, images:card_images(*), grading:card_gradings(*)),
      seller:profiles(*)
    `)
    .eq("status", "active");

  if (filters?.query) {
    query = query.ilike("cards.name", `%${filters.query}%`);
  }
  if (filters?.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters?.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }
  if (filters?.graders?.length) {
    query = query.in("cards.grading.grader", filters.graders);
  }
  if (filters?.sortBy === "price_asc") query = query.order("price", { ascending: true });
  if (filters?.sortBy === "price_desc") query = query.order("price", { ascending: false });
  if (filters?.sortBy === "newest") query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as Listing[];
}

export async function getListingById(id: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      card:cards(*, images:card_images(*), grading:card_gradings(*)),
      seller:profiles(*)
    `)
    .eq("id", id)
    .single();

  if (error) return null;
  return data as unknown as Listing;
}

export async function createListing(listing: Partial<Listing>): Promise<Listing> {
  const { data, error } = await supabase
    .from("listings")
    .insert([listing])
    .select()
    .single();

  if (error) throw error;
  return data as unknown as Listing;
}

// ─── Images ──────────────────────────────────────────────────────────────────

export async function uploadCardImage(
  file: File | Blob,
  listingId: string,
  fileName: string
): Promise<string> {
  const path = `listings/${listingId}/${fileName}`;
  const { error } = await supabase.storage.from("card-images").upload(path, file, {
    upsert: true,
    contentType: "image/jpeg",
  });
  if (error) throw error;

  const { data } = supabase.storage.from("card-images").getPublicUrl(path);
  return data.publicUrl;
}

// ─── Profiles ────────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data as unknown as UserProfile;
}

export async function getProfileByUsername(username: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) return null;
  return data as unknown as UserProfile;
}

// ─── Offers ──────────────────────────────────────────────────────────────────

export async function createOffer(offer: Partial<Offer>): Promise<Offer> {
  const { data, error } = await supabase
    .from("offers")
    .insert([offer])
    .select()
    .single();

  if (error) throw error;
  return data as unknown as Offer;
}

export async function getOffersForListing(listingId: string): Promise<Offer[]> {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("listing_id", listingId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as Offer[];
}
