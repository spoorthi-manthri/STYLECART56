// ===== Fabric Product Page =====
// Shows products matching BOTH a fabric type and a garment category.
// e.g. /fabric/Silk/Dresses → all silk dresses.

import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { sampleProducts } from '@/data/products';
import type { FabricCategory, GarmentCategory } from '@/types';

export default function FabricProductPage() {
  const { fabric, category } = useParams<{ fabric: string; category: string }>();
  const fabricName = fabric as FabricCategory;
  const categoryName = category as GarmentCategory;
  const [sortBy, setSortBy] = useState('featured');

  const products = useMemo(() => {
    let result = sampleProducts.filter(
      (p) => p.fabric === fabricName && p.category === categoryName
    );
    switch (sortBy) {
      case 'price-low':
        result = [...result].sort(
          (a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price)
        );
        break;
      case 'price-high':
        result = [...result].sort(
          (a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price)
        );
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
    }
    return result;
  }, [fabricName, categoryName, sortBy]);

  return (
    <div className="bg-[#faf7f2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            <Link to="/" className="hover:text-[#800020]">Home</Link>
            {' / '}
            <Link to={`/fabric/${fabricName}`} className="hover:text-[#800020]">{fabricName}</Link>
            {' / '}
            <span className="text-[#800020]">{categoryName}</span>
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {fabricName} {categoryName}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={`/fabric/${fabricName}`}
                className="flex items-center gap-1 text-sm text-[#800020] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> Back to {fabricName}
              </Link>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#800020]"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No {fabricName.toLowerCase()} {categoryName.toLowerCase()} found. Try another combination.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
