// ===== Navbar =====
// Top navigation bar with logo, search, garment + fabric category dropdowns,
// cart badge, and login/logout button.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut, Menu, X, Scissors } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { garmentCategories, fabricCategories } from '@/data/products';

export default function Navbar() {
  const { totalItems } = useCart();
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category/all?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  }

  function handleSignOut() {
    signOut();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-[#800020] text-cream text-center py-1.5 text-xs sm:text-sm">
        Free delivery on orders above Rs. 2000 &nbsp;|&nbsp; Tailor service available
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <ShoppingBag className="w-7 h-7 text-[#800020]" />
          <span className="text-xl font-bold tracking-tight text-[#800020]">STYLECART</span>
        </Link>

        {/* Search bar — desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for dresses, tops, sarees..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-[#faf7f2] text-sm focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          {/* Auth */}
          {session ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-600">{session.user.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 text-sm text-[#800020] hover:underline"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#800020] hover:underline"
            >
              <User className="w-4 h-4" /> Login
            </Link>
          )}

          {/* Tailor service link */}
          <Link
            to="/tailor"
            className="hidden lg:flex items-center gap-1 text-sm font-medium text-[#800020] hover:underline"
          >
            <Scissors className="w-4 h-4" /> Tailor
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative flex items-center gap-1 text-[#800020]">
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#800020] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#800020]">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Category bar — desktop */}
      <div className="hidden md:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 py-2.5 text-sm">
          {/* Shop by garment type */}
          <div className="group relative">
            <button className="font-medium text-gray-700 hover:text-[#800020]">
              Shop by Type
            </button>
            <div className="absolute left-0 top-full bg-white shadow-lg rounded-b-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {garmentCategories.map((cat) => (
                <Link
                  key={cat}
                  to={`/category/${cat}`}
                  className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-[#faf7f2] hover:text-[#800020]"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Shop by fabric */}
          <div className="group relative">
            <button className="font-medium text-gray-700 hover:text-[#800020]">
              Shop by Fabric
            </button>
            <div className="absolute left-0 top-full bg-white shadow-lg rounded-b-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {fabricCategories.map((fab) => (
                <Link
                  key={fab}
                  to={`/fabric/${fab}`}
                  className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-[#faf7f2] hover:text-[#800020]"
                >
                  {fab}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/tailor" className="font-medium text-gray-700 hover:text-[#800020]">
            Tailor Service
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-[#faf7f2] text-sm focus:outline-none focus:border-[#800020]"
            />
          </form>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">By Type</p>
          <div className="grid grid-cols-2 gap-2">
            {garmentCategories.map((cat) => (
              <Link
                key={cat}
                to={`/category/${cat}`}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-gray-700 hover:text-[#800020]"
              >
                {cat}
              </Link>
            ))}
          </div>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">By Fabric</p>
          <div className="grid grid-cols-2 gap-2">
            {fabricCategories.map((fab) => (
              <Link
                key={fab}
                to={`/fabric/${fab}`}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-gray-700 hover:text-[#800020]"
              >
                {fab}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100 space-y-2">
            <Link
              to="/tailor"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-[#800020]"
            >
              Tailor Service
            </Link>
            {session ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileOpen(false);
                }}
                className="block text-sm text-[#800020]"
              >
                Logout ({session.user.email})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-[#800020]"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
