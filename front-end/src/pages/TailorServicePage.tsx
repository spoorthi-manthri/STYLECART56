// ===== Tailor Service Page =====
// Customers can request alterations or custom stitching for any garment.
// They describe the changes, set a budget, choose to meet or call the
// tailor, and optionally upload a reference image.
// If navigated from a product card, the garment type and product name
// are pre-filled via router state.

import { useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Scissors, Upload, CheckCircle, AlertCircle, Phone, Users } from 'lucide-react';
import { submitTailorRequest } from '@/api/client';
import { garmentCategories } from '@/data/products';

// Read pre-fill data passed from ProductCard via navigate state
interface TailorNavState {
  garmentType?: string;
  productName?: string;
}

export default function TailorServicePage() {
  const location = useLocation();
  const navState = (location.state ?? {}) as TailorNavState;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    garmentType: navState.garmentType ?? 'Dresses',
    serviceType: 'alteration' as 'alteration' | 'stitching',
    description: navState.productName ? `Alterations for: ${navState.productName}. ` : '',
    measurements: '',
    budget: '',
    preferredDate: '',
    contactPreference: 'meet' as 'meet' | 'call',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Show a local preview — the image preview is currently local to this browser session
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function validate(): boolean {
    if (!form.customerName.trim()) return false;
    if (!form.phone.trim() || form.phone.length < 10) return false;
    if (!form.description.trim()) return false;
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      setError('Please fill in your name, phone, and describe what you need.');
      return;
    }

    setSubmitting(true);
    const { data, error: apiError } = await submitTailorRequest({
      customer_name: form.customerName,
      phone: form.phone,
      garment_type: form.garmentType,
      service_type: form.serviceType,
      description: form.description,
      measurements: form.measurements || undefined,
      budget: form.budget ? Number(form.budget) : undefined,
      preferred_date: form.preferredDate || undefined,
      contact_preference: form.contactPreference,
      image_url: undefined, // Image preview is local; file upload needs a dedicated backend endpoint.
    });
    setSubmitting(false);

    if (apiError || !data) {
      setError(apiError ?? 'Could not submit your request. Please try again.');
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="bg-[#faf7f2] min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-sm">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Request Submitted!</h2>
          <p className="text-sm text-gray-500 mt-2">
            A tailor will contact you soon to discuss your {form.serviceType} for your{' '}
            {form.garmentType.toLowerCase()}. {form.contactPreference === 'meet'
              ? 'They will arrange an in-person meeting.'
              : 'They will give you a call.'}
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

  return (
    <div className="bg-[#faf7f2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-[#800020]/10 rounded-full flex items-center justify-center mb-3">
            <Scissors className="w-8 h-8 text-[#800020]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Tailor Service</h1>
          <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
            Need to stitch a new garment or make changes to an existing one? Tell us what you
            need and your budget — we'll connect you with a tailor. You can meet in person or
            arrange a call.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
          {/* Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Your Name *</label>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Phone *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
              />
            </div>
          </div>

          {/* Garment type + service type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Garment Type</label>
              <select
                value={form.garmentType}
                onChange={(e) => setForm({ ...form, garmentType: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
              >
                {garmentCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Service Type</label>
              <select
                value={form.serviceType}
                onChange={(e) =>
                  setForm({ ...form, serviceType: e.target.value as 'alteration' | 'stitching' })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
              >
                <option value="alteration">Alteration (modify existing)</option>
                <option value="stitching">Stitching (new garment)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-600">
              Describe what you need * {navState.productName && '(pre-filled from your product)'}
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="e.g. I need to shorten the sleeves and take in the waist by 2 inches..."
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
            />
          </div>

          {/* Measurements */}
          <div>
            <label className="text-sm text-gray-600">Measurements (optional)</label>
            <input
              type="text"
              value={form.measurements}
              onChange={(e) => setForm({ ...form, measurements: e.target.value })}
              placeholder="e.g. Chest 36, Waist 30, Length 42"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
            />
          </div>

          {/* Budget + date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Budget (Rs.) — keep it affordable</label>
              <input
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="e.g. 500"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Preferred Date</label>
              <input
                type="date"
                value={form.preferredDate}
                onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
              />
            </div>
          </div>

          {/* Contact preference */}
          <div>
            <label className="text-sm text-gray-600 block mb-2">How would you like to connect?</label>
            <div className="flex gap-4">
              <label
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                  form.contactPreference === 'meet'
                    ? 'bg-[#800020] text-white border-[#800020]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#800020]'
                }`}
              >
                <input
                  type="radio"
                  name="contactPref"
                  checked={form.contactPreference === 'meet'}
                  onChange={() => setForm({ ...form, contactPreference: 'meet' })}
                  className="hidden"
                />
                <Users className="w-4 h-4" /> Meet in person
              </label>
              <label
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                  form.contactPreference === 'call'
                    ? 'bg-[#800020] text-white border-[#800020]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#800020]'
                }`}
              >
                <input
                  type="radio"
                  name="contactPref"
                  checked={form.contactPreference === 'call'}
                  onChange={() => setForm({ ...form, contactPreference: 'call' })}
                  className="hidden"
                />
                <Phone className="w-4 h-4" /> Arrange a call
              </label>
            </div>
          </div>

          {/* Reference image upload */}
          <div>
            <label className="text-sm text-gray-600 block mb-2">Reference Image (optional)</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-[#800020] transition-colors"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Reference" className="max-h-40 mx-auto rounded-lg" />
              ) : (
                <div className="text-gray-400">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Click to upload a reference image</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#800020] text-white font-semibold py-3 rounded-lg hover:bg-[#6b0019] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Tailor Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
