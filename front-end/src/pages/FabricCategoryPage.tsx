// ===== Fabric Category Page =====
// When a customer picks a fabric (Silk, Cotton, etc.), this page shows
// all garment categories available in that fabric. Clicking a garment
// type navigates to the FabricProductPage showing only those products.

import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getProductsByFabric, garmentCategories } from '@/data/products';
import type { FabricCategory, GarmentCategory } from '@/types';

export default function FabricCategoryPage() {
  const { fabric } = useParams<{ fabric: string }>();
  const fabricName = fabric as FabricCategory;

  const products = getProductsByFabric(fabricName);

  // Count how many products exist per garment type within this fabric
  const counts = garmentCategories.map((cat) => ({
    category: cat,
    count: products.filter((p) => p.category === cat).length,
  }));
  const available = counts.filter((c) => c.count > 0);

  return (
    <div className="bg-[#faf7f2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            <Link to="/" className="hover:text-[#800020]">Home</Link>
            {' / '}
            <span className="text-[#800020]">{fabricName}</span>
          </p>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">{fabricName} Collection</h1>
          <p className="text-sm text-gray-500 mt-1">
            Choose a garment type below to see all {fabricName.toLowerCase()} {fabricName === 'Denim' ? 'jeans & more' : 'clothing'} available.
          </p>
        </div>

        {/* Garment type cards */}
        {available.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No products found in {fabricName}. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {available.map(({ category, count }) => (
              <Link
                key={category}
                to={`/fabric/${fabricName}/${category}`}
                className="bg-white border border-gray-100 rounded-xl p-6 text-center hover:shadow-md hover:border-[#800020] transition-all group"
              >
                <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
                <p className="text-sm text-gray-500 mt-1">{count} product{count !== 1 ? 's' : ''}</p>
                <span className="inline-flex items-center gap-1 text-sm text-[#800020] mt-3 group-hover:underline">
                  Browse {category} <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
