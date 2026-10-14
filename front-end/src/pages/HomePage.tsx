// ===== Home Page =====
// Hero banner, fabric category showcase, garment category grid,
// and featured products section.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchProducts } from '@/api/client';
import { garmentCategories, fabricCategories } from '@/data/products';
import type { Product } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  // Show up to 8 featured products
  const featured = products.slice(0, 8);

  return (
      <div className="bg-[#faf7f2]">
        {/* Hero */}
        <section className="relative h-[420px] sm:h-[500px] overflow-hidden">
          <img
              src="https://images.pexels.com/photos/31763620/pexels-photo-31763620.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Boutique storefront"
              className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#800020]/80 to-[#800020]/30" />
          <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center text-white">
            <p className="text-sm uppercase tracking-widest text-cream/80 mb-2">New Collection 2026</p>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight max-w-xl">
              Find exactly what you're looking for
            </h1>
            <p className="mt-3 text-cream/90 max-w-md text-sm sm:text-base">
              Shop by fabric — silk, cotton, linen — or by garment type. Dresses, tops, sarees, kurtis & more.
            </p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <Link
                  to="/category/Dresses"
                  className="bg-white text-[#800020] font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-cream transition-colors"
              >
                Shop Now
              </Link>
              <Link
                  to="/tailor"
                  className="flex items-center gap-2 border border-white/60 text-white px-5 py-2.5 rounded-full text-sm hover:bg-white/10 transition-colors"
              >
                <Scissors className="w-4 h-4" /> Tailor Service
              </Link>
            </div>
          </div>
        </section>

        {/* Fabric categories */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#800020]" />
            <h2 className="text-xl font-bold text-gray-800">Shop by Fabric</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Choose a cloth type — silk, cotton, linen and more — to see all garments available in that fabric.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {fabricCategories.map((fabric) => (
                <Link
                    key={fabric}
                    to={`/fabric/${fabric}`}
                    className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:shadow-md hover:border-[#800020] transition-all group"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#faf7f2] flex items-center justify-center mb-2 group-hover:bg-[#800020]/10 transition-colors">
                <span className="text-sm font-bold text-[#800020]">
                  {fabric.charAt(0)}
                </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{fabric}</span>
                </Link>
            ))}
          </div>
        </section>

        {/* Garment categories */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {garmentCategories.map((cat) => (
                <Link
                    key={cat}
                    to={`/category/${cat}`}
                    className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:shadow-md hover:border-[#800020] transition-all"
                >
                  <span className="text-sm font-semibold text-gray-700">{cat}</span>
                </Link>
            ))}
          </div>
        </section>

        {/* Featured products */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>
            <Link
                to="/category/Dresses"
                className="flex items-center gap-1 text-sm text-[#800020] hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Tailor service banner */}
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="bg-[#800020] rounded-2xl p-6 sm:p-10 text-center text-white">
            <Scissors className="w-10 h-10 mx-auto mb-3" />
            <h2 className="text-xl sm:text-2xl font-bold">Need a tailor?</h2>
            <p className="text-cream/80 mt-2 max-w-lg mx-auto text-sm">
              Get alterations or custom stitching for any garment. Meet a tailor in person or
              arrange a call — all within your budget.
            </p>
            <Link
                to="/tailor"
                className="inline-block mt-4 bg-white text-[#800020] font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-cream transition-colors"
            >
              Request Tailor Service
            </Link>
          </div>
        </section>
      </div>
  );
}
