// ===== Cart Page =====
// Shows all items in the cart with their selected size and color,
// quantity controls, remove buttons, and an order summary.
// Free delivery is offered on orders above Rs. 2000.

import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();

  const deliveryFee = totalPrice >= 2000 || totalPrice === 0 ? 0 : 99;
  const grandTotal = totalPrice + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="bg-[#faf7f2] min-h-screen flex items-center justify-center">
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
          <p className="text-sm text-gray-500 mt-2">Browse our collection and add your favourites.</p>
          <Link
            to="/"
            className="inline-block mt-4 bg-[#800020] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#6b0019] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf7f2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Shopping Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4"
              >
                {/* Image */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-32 object-cover rounded-lg shrink-0"
                />

                {/* Details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase">{item.product.brand}</p>
                      <h3 className="text-sm font-semibold text-gray-800">{item.product.name}</h3>
                      <p className="text-xs text-[#800020] mt-1">{item.product.fabric}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Size + Color */}
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-gray-500">
                      Size: <span className="font-medium text-gray-700">{item.selectedSize}</span>
                    </span>
                    <span className="text-gray-500">
                      Color: <span className="font-medium text-gray-700">{item.selectedColor}</span>
                    </span>
                  </div>

                  {/* Price + quantity */}
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#800020]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#800020]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-[#800020]">
                        Rs. {((item.product.discountPrice ?? item.product.price) * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.product.discountPrice && (
                        <span className="block text-xs text-gray-400 line-through">
                          Rs. {(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm text-[#800020] hover:underline"
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 h-fit sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}</span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-[#800020] bg-[#faf7f2] rounded p-2">
                  Add Rs. {(2000 - totalPrice).toLocaleString('en-IN')} more for free delivery!
                </p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span className="text-[#800020]">Rs. {grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block mt-5 bg-[#800020] text-white text-center font-semibold py-3 rounded-lg hover:bg-[#6b0019] transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
