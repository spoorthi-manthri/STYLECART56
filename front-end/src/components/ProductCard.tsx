// ===== Product Card =====
// Displays a single product with image, brand, price (with discount),
// size selector, color selector, Add to Cart, Buy Now, and a tailor
// service shortcut (if the product supports tailoring).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Scissors, Star, Truck } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  function handleAddToCart() {
    addToCart(product, selectedSize, selectedColor);
  }

  function handleBuyNow() {
    addToCart(product, selectedSize, selectedColor, 1);
    navigate('/checkout');
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-[#faf7f2]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-[#800020] text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercent}% OFF
          </span>
        )}
        {/* Tailor available badge */}
        {product.tailorAvailable && (
          <span className="absolute top-2 right-2 bg-white/90 text-[#800020] text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
            <Scissors className="w-3 h-3" /> Tailor
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* Brand + rating */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {product.brand}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {product.rating}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-800 leading-snug">{product.name}</h3>

        {/* Fabric tag + delivery */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-block text-xs text-[#800020] bg-[#faf7f2] px-2 py-0.5 rounded-full">
            {product.fabric}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <Truck className="w-3 h-3" />
            {product.deliveryDays} day delivery
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#800020]">
            Rs. {effectivePrice.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              Rs. {product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Size selector */}
        <div>
          <label className="text-xs text-gray-500">Size</label>
          <div className="flex gap-1 flex-wrap mt-1">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2 py-1 text-xs border rounded transition-colors ${
                  selectedSize === size
                    ? 'bg-[#800020] text-white border-[#800020]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#800020]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color selector */}
        <div>
          <label className="text-xs text-gray-500">Color</label>
          <div className="flex gap-1 flex-wrap mt-1">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-2 py-1 text-xs border rounded transition-colors ${
                  selectedColor === color
                    ? 'bg-[#800020] text-white border-[#800020]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#800020]'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto pt-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1 bg-white border border-[#800020] text-[#800020] text-sm font-medium py-2 rounded-lg hover:bg-[#faf7f2] transition-colors"
          >
            <ShoppingCart className="w-4 h-4" /> Add
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-1 bg-[#800020] text-white text-sm font-medium py-2 rounded-lg hover:bg-[#6b0019] transition-colors"
          >
            <Zap className="w-4 h-4" /> Buy Now
          </button>
        </div>

        {/* Tailor shortcut */}
        {product.tailorAvailable && (
          <button
            onClick={() =>
              navigate('/tailor', {
                state: { garmentType: product.category, productName: product.name },
              })
            }
            className="flex items-center justify-center gap-1 text-xs text-[#800020] hover:underline pt-1"
          >
            <Scissors className="w-3.5 h-3.5" />
            Request tailor service for this item
          </button>
        )}
      </div>
    </div>
  );
}
