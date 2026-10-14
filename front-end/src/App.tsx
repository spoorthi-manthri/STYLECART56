// ===== STYLECART App Root =====
// Sets up routing, wraps the app in AuthProvider + CartProvider,
// and renders the Navbar / Footer layout around each page.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import CategoryPage from '@/pages/CategoryPage';
import FabricCategoryPage from '@/pages/FabricCategoryPage';
import FabricProductPage from '@/pages/FabricProductPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import TailorServicePage from '@/pages/TailorServicePage';
import LoginPage from '@/pages/LoginPage';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-[#faf7f2]">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/fabric/:fabric" element={<FabricCategoryPage />} />
                <Route path="/fabric/:fabric/:category" element={<FabricProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/tailor" element={<TailorServicePage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
