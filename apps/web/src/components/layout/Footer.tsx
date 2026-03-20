import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-red text-white font-black text-lg">
                P
              </div>
              <span className="text-lg font-black text-white">
                Poke<span className="text-brand-red">Grade</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              The premier marketplace for authenticated, graded Pokémon cards. Buy, sell, and trade with confidence.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/listings" className="hover:text-white transition">Browse All</Link></li>
              <li><Link href="/listings?grader=PSA" className="hover:text-white transition">PSA Graded</Link></li>
              <li><Link href="/listings?grader=BGS" className="hover:text-white transition">BGS Graded</Link></li>
              <li><Link href="/listings?type=auction" className="hover:text-white transition">Auctions</Link></li>
              <li><Link href="/listings?type=trade" className="hover:text-white transition">Trades</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Sellers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sell" className="hover:text-white transition">List a Card</Link></li>
              <li><Link href="/sell/guide" className="hover:text-white transition">Seller Guide</Link></li>
              <li><Link href="/sell/fees" className="hover:text-white transition">Fees & Pricing</Link></li>
              <li><Link href="/sell/shipping" className="hover:text-white transition">Shipping Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-white transition">Help Centre</Link></li>
              <li><Link href="/authenticity" className="hover:text-white transition">Authenticity Guarantee</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2024 PokeGrade Ltd. All rights reserved.</p>
          <p>Not affiliated with Nintendo, Game Freak, or The Pokémon Company.</p>
        </div>
      </div>
    </footer>
  );
}
