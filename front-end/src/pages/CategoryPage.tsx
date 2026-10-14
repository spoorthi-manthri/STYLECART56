// ===== Category Page =====
// Lists all products for a given garment category (Dresses, Tops, Jeans, etc.)
// with sorting and optional search filtering via the `q` query param.
// When the route is /category/all, shows all products.

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { fetchProducts } from '@/api/client';
import type { Product } from '@/types';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setLoading(true);
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Filter by category (unless "all") and by search query
  const filtered = useMemo(() => {
    let result = products;
    if (category && category !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    // Sort
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
  }, [products, category, searchQuery, sortBy]);

  const title = category && category !== 'all' ? category : 'All Products';

  return (
    <div className="bg-[#faf7f2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery ? `Results for "${searchQuery}"` : `Showing all ${title.toLowerCase()}`}
              {' — '}
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Sort dropdown */}
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

        {/* Products grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No products found. Try a different search or category.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
