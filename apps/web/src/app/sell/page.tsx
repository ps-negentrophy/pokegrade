"use client";

import { useState, useRef } from "react";
import { Upload, Camera, X, ChevronRight, ChevronLeft, CheckCircle, Info } from "lucide-react";
import Image from "next/image";

const STEPS = [
  { id: 1, label: "Photos" },
  { id: 2, label: "Card Info" },
  { id: 3, label: "Grading" },
  { id: 4, label: "Pricing" },
  { id: 5, label: "Review" },
];

const GRADERS = ["PSA", "BGS", "CGC", "SGC"];
const LANGUAGES = ["English", "Japanese", "Korean", "Chinese"];
const SETS = ["Base Set", "Jungle", "Fossil", "Team Rocket", "Neo Genesis", "Neo Discovery", "Neo Revelation", "Neo Destiny", "Gym Heroes", "Gym Challenge", "E-Card Series", "EX Series", "Other"];

interface UploadedImage {
  url: string;
  label: string;
  file?: File;
}

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cardName, setCardName] = useState("");
  const [set, setSet] = useState("");
  const [setNumber, setSetNumber] = useState("");
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("English");
  const [rarity, setRarity] = useState("");
  const [isFirstEdition, setIsFirstEdition] = useState(false);
  const [isShadowless, setIsShadowless] = useState(false);

  const [grader, setGrader] = useState("");
  const [grade, setGrade] = useState("");
  const [certNumber, setCertNumber] = useState("");

  const [listingType, setListingType] = useState<"fixed" | "auction" | "trade">("fixed");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [shippingCost, setShippingCost] = useState("");

  const handleFileDrop = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).slice(0, 4 - images.length).forEach((file) => {
      const url = URL.createObjectURL(file);
      const labels = ["front", "back", "label", "slab"];
      setImages((prev) => [
        ...prev,
        { url, label: labels[prev.length] ?? "other", file },
      ]);
    });
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const canProceed = (): boolean => {
    if (step === 1) return images.length > 0;
    if (step === 2) return !!cardName && !!set && !!year;
    if (step === 3) return !!grader && !!grade && !!certNumber;
    if (step === 4) return !!price;
    return true;
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">List a Card</h1>
        <p className="text-gray-500 mt-1">Sell your graded Pokémon card to thousands of collectors worldwide.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold border-2 transition-all ${
                step > s.id
                  ? "bg-green-500 border-green-500 text-white"
                  : step === s.id
                  ? "bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/30"
                  : "bg-white border-gray-200 text-gray-400"
              }`}>
                {step > s.id ? <CheckCircle className="h-5 w-5" /> : s.id}
              </div>
              <span className={`mt-1 text-xs font-medium ${step === s.id ? "text-brand-red" : "text-gray-400"}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-[-1rem] transition-colors ${step > s.id ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 sm:p-8">
        {/* Step 1: Photos */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Upload Photos</h2>
            <p className="text-sm text-gray-500 mb-6">Upload up to 4 photos: front, back, label, and full slab. High-quality images lead to faster sales.</p>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileDrop(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition ${
                isDragging ? "border-brand-red bg-red-50" : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200">
                <Upload className="h-7 w-7 text-gray-500" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-700">Drag &amp; drop or click to upload</p>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG up to 10MB each · Max 4 images</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => handleFileDrop(e.target.files)}
              />
            </div>

            {/* Camera note */}
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 bg-blue-50 rounded-lg px-3 py-2">
              <Camera className="h-4 w-4 text-blue-400 shrink-0" />
              <span>On mobile, you can take photos directly with your camera when uploading.</span>
            </div>

            {/* Preview grid */}
            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
                    <Image src={img.url} alt={img.label} fill className="object-contain p-1" sizes="120px" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] text-center py-0.5 capitalize">{img.label}</div>
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition"
                  >
                    <span className="text-3xl text-gray-300">+</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Card Info */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Card Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Name *</label>
              <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="e.g. Charizard" className="input-base" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Set *</label>
                <select value={set} onChange={(e) => setSet(e.target.value)} className="input-base">
                  <option value="">Select set…</option>
                  {SETS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Set Number</label>
                <input value={setNumber} onChange={(e) => setSetNumber(e.target.value)} placeholder="e.g. 4/102" className="input-base" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Year *</label>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 1999" min={1996} max={2025} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-base">
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rarity</label>
              <input value={rarity} onChange={(e) => setRarity(e.target.value)} placeholder="e.g. Holo Rare" className="input-base" />
            </div>

            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={isFirstEdition} onChange={(e) => setIsFirstEdition(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-red focus:ring-brand-red" />
                <span className="text-sm font-medium text-gray-700">1st Edition</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={isShadowless} onChange={(e) => setIsShadowless(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-red focus:ring-brand-red" />
                <span className="text-sm font-medium text-gray-700">Shadowless</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Grading */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Grading Details</h2>

            <div className="bg-blue-50 rounded-lg p-3 flex gap-2 text-sm text-blue-700">
              <Info className="h-5 w-5 shrink-0 mt-0.5" />
              <span>We verify every cert number against the grading company&apos;s database before your listing goes live.</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Grading Company *</label>
              <div className="grid grid-cols-4 gap-2">
                {GRADERS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrader(g)}
                    className={`rounded-xl border-2 py-3 text-sm font-bold transition ${
                      grader === g
                        ? "border-brand-red bg-red-50 text-brand-red"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade *</label>
              <div className="grid grid-cols-5 gap-2">
                {[7, 7.5, 8, 8.5, 9, 9.5, 10].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g.toString())}
                    className={`rounded-xl border-2 py-2.5 text-sm font-bold transition ${
                      grade === g.toString()
                        ? g === 10
                          ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                          : "border-brand-red bg-red-50 text-brand-red"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Certificate Number *</label>
              <input
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                placeholder="e.g. 12345678"
                className="input-base"
              />
              <p className="mt-1 text-xs text-gray-400">Found on the front label of the graded slab.</p>
            </div>
          </div>
        )}

        {/* Step 4: Pricing */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Pricing & Listing Type</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "fixed", label: "Fixed Price", desc: "Set a price, sell instantly" },
                  { value: "auction", label: "Auction", desc: "Let buyers bid competitively" },
                  { value: "trade", label: "Trade / Offer", desc: "Open to swaps & offers" },
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setListingType(t.value as "fixed" | "auction" | "trade")}
                    className={`text-left rounded-xl border-2 p-3 transition ${
                      listingType === t.value
                        ? "border-brand-red bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className={`text-sm font-bold ${listingType === t.value ? "text-brand-red" : "text-gray-700"}`}>{t.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {listingType === "auction" ? "Starting Bid *" : "Price *"}
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  min={0}
                  className="input-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input-base">
                  {["USD", "GBP", "HKD", "EUR", "AUD", "JPY"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Shipping Cost (leave 0 for free)</label>
              <input
                type="number"
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
                placeholder="0"
                min={0}
                className="input-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe the card's condition, notable attributes, or anything buyers should know..."
                className="input-base resize-none"
              />
            </div>

            <div className="bg-yellow-50 rounded-lg p-3 text-sm text-yellow-700 border border-yellow-200">
              <p className="font-semibold mb-0.5">Platform fee: 5%</p>
              <p className="text-xs">
                {price ? `You'll receive approx. ${new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(parseFloat(price) * 0.95)} after fees.` : "Enter a price to see your earnings."}
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Listing</h2>

            <div className="space-y-4">
              {images.length > 0 && (
                <div className="flex gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-16 aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image src={img.url} alt={img.label} fill className="object-contain p-1" sizes="64px" />
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-xl bg-gray-50 border border-gray-200 divide-y divide-gray-100">
                {[
                  { label: "Card", value: cardName || "—" },
                  { label: "Set", value: set ? `${set}${setNumber ? ` #${setNumber}` : ""}` : "—" },
                  { label: "Year", value: year || "—" },
                  { label: "Language", value: language },
                  { label: "Edition", value: [isFirstEdition && "1st Edition", isShadowless && "Shadowless"].filter(Boolean).join(", ") || "Unlimited" },
                  { label: "Grade", value: grader && grade ? `${grader} ${grade}` : "—" },
                  { label: "Cert #", value: certNumber || "—" },
                  { label: "Price", value: price ? `${new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(parseFloat(price))} (${listingType})` : "—" },
                  { label: "Shipping", value: shippingCost && parseFloat(shippingCost) > 0 ? `${currency} ${shippingCost}` : "Free" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between px-4 py-2.5 text-sm">
                    <span className="text-gray-500">{row.label}</span>
                    <span className="font-medium text-gray-900 text-right">{row.value}</span>
                  </div>
                ))}
              </div>

              <button className="btn-primary w-full text-base py-3.5 mt-2">
                <CheckCircle className="h-5 w-5" /> Submit Listing
              </button>
              <p className="text-center text-xs text-gray-400">
                By submitting, you agree to our Seller Terms & Conditions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        {step < 5 && (
          <button
            onClick={() => setStep((s) => Math.min(5, s + 1))}
            disabled={!canProceed()}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
