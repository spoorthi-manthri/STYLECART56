// ===== Checkout Page =====
// Collects delivery details (pre-filled from login + saved profile),
// shows the order summary with estimated delivery date/time,
// and places the order via the API client. Payment method is COD.
// The order is only confirmed when the database confirms success.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Truck, Calendar, Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { submitOrder } from '@/api/client';
import { loadProfile, saveProfile } from '@/lib/profile';
import type { DeliveryDetails } from '@/types';

// Available delivery time slots
const TIME_SLOTS = [
  '9 AM - 12 PM',
  '12 PM - 3 PM',
  '3 PM - 6 PM',
  '6 PM - 9 PM',
];

// Compute the earliest delivery date (min of all product deliveryDays + 1)
function getEarliestDeliveryDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { session } = useAuth();

  // Pre-fill from saved profile + login email
  const saved = loadProfile();
  const [details, setDetails] = useState<DeliveryDetails>({
    customerName: saved.customerName,
    email: session?.user.email ?? saved.email,
    phone: saved.phone,
    address: saved.address,
    city: saved.city,
    pincode: saved.pincode,
    deliveryDate: '',
    deliveryTime: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryFee = totalPrice >= 2000 ? 0 : 99;
  const grandTotal = totalPrice + deliveryFee;

  // The longest delivery time among cart items determines the earliest date
  const maxDeliveryDays = items.length > 0
    ? Math.max(...items.map((i) => i.product.deliveryDays))
    : 3;
  const earliestDate = getEarliestDeliveryDate(maxDeliveryDays);

  // Validate — returns an error message string or null if all good
  function validate(): string | null {
    if (!details.customerName.trim()) return 'Please enter your full name.';
    if (!details.email.trim() || !details.email.includes('@')) return 'Please enter a valid email.';
    if (!details.phone.trim() || details.phone.replace(/\D/g, '').length < 10)
      return 'Please enter a valid 10-digit phone number.';
    if (!details.address.trim()) return 'Please enter your delivery address.';
    if (!details.city.trim()) return 'Please enter your city.';
    if (!details.pincode.trim() || details.pincode.length < 6)
      return 'Please enter a valid 6-digit pincode.';
    if (!details.deliveryDate) return 'Please choose a preferred delivery date.';
    if (!details.deliveryTime) return 'Please choose a delivery time slot.';
    return null;
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);

    // Save the profile so it's pre-filled next time
    saveProfile({
      customerName: details.customerName,
      email: details.email,
      phone: details.phone,
      address: details.address,
      city: details.city,
      pincode: details.pincode,
    });

    const { data, error: apiError } = await submitOrder({
      customer_name: details.customerName,
      email: details.email,
      phone: details.phone,
      address: details.address,
      city: details.city,
      pincode: details.pincode,
      delivery_date: details.deliveryDate,
      delivery_time: details.deliveryTime,
      items,
      total: grandTotal,
      payment_method: 'COD',
    });
    setSubmitting(false);

    if (apiError || !data) {
      setError(apiError ?? 'Could not place your order. Please try again.');
      return;
    }

    clearCart();
    setSuccess(true);
  }

  // ---- Success state ----
  if (success) {
    return (
      <div className="bg-[#faf7f2] min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-sm">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Order Placed Successfully!</h2>
          <p className="text-sm text-gray-500 mt-2">
            Thank you for shopping with STYLECART. Your order will be delivered on{' '}
            <strong>{details.deliveryDate}</strong> between <strong>{details.deliveryTime}</strong>{' '}
            with Cash on Delivery.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 bg-[#800020] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#6b0019] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ---- Empty cart ----
  if (items.length === 0) {
    return (
      <div className="bg-[#faf7f2] min-h-screen flex items-center justify-center">
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Checkout</h1>
        {session && (
          <p className="text-sm text-green-600 mb-4">
            Signed in as {session.user.email} — your details have been pre-filled.
          </p>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Delivery details */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-5 h-5 text-[#800020]" />
              <h2 className="text-lg font-bold text-gray-800">Delivery Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Full Name *</label>
                <input
                  type="text"
                  value={details.customerName}
                  onChange={(e) => setDetails({ ...details, customerName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email *</label>
                <input
                  type="email"
                  value={details.email}
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone *</label>
                <input
                  type="tel"
                  value={details.phone}
                  onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Pincode *</label>
                <input
                  type="text"
                  maxLength={6}
                  value={details.pincode}
                  onChange={(e) => setDetails({ ...details, pincode: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-600">Address *</label>
                <textarea
                  value={details.address}
                  onChange={(e) => setDetails({ ...details, address: e.target.value })}
                  rows={2}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">City *</label>
                <input
                  type="text"
                  value={details.city}
                  onChange={(e) => setDetails({ ...details, city: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
                />
              </div>
            </div>

            {/* Preferred delivery date + time */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#800020]" />
                Preferred Delivery Date &amp; Time
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Earliest available: {earliestDate}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Delivery Date *</label>
                  <input
                    type="date"
                    min={earliestDate}
                    value={details.deliveryDate}
                    onChange={(e) => setDetails({ ...details, deliveryDate: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Delivery Time Slot *
                  </label>
                  <select
                    value={details.deliveryTime}
                    onChange={(e) => setDetails({ ...details, deliveryTime: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
                  >
                    <option value="">Select a time slot</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment Method</h3>
              <div className="flex items-center gap-2 bg-[#faf7f2] rounded-lg p-3">
                <input type="radio" checked readOnly className="accent-[#800020]" />
                <span className="text-sm text-gray-700">Cash on Delivery (COD)</span>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 h-fit sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="flex gap-3 text-sm"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-xs">{item.product.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.selectedSize} / {item.selectedColor} / Qty {item.quantity}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Truck className="w-3 h-3" />
                      {item.product.deliveryDays} day delivery
                    </p>
                    <p className="text-xs font-semibold text-[#800020] mt-1">
                      Rs. {((item.product.discountPrice ?? item.product.price) * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-[#800020]">Rs. {grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 mt-4 text-sm text-red-600 bg-red-50 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-5 bg-[#800020] text-white font-semibold py-3 rounded-lg hover:bg-[#6b0019] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Placing Order...' : 'Place Order (COD)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
