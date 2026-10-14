// ===== Footer =====
// Footer with brand info, quick links, and contact details.

import { Link } from 'react-router-dom';
import { ShoppingBag, Scissors, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#800020] text-cream mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="w-6 h-6" />
            <span className="text-lg font-bold">STYLECART</span>
          </div>
          <p className="text-sm text-cream/80 leading-relaxed">
            Your one-stop destination for elegant clothing in silk, cotton, linen and more.
            Shop by garment type or fabric — and get tailor service for the perfect fit.
          </p>
        </div>

        {/* Shop links */}
        <div>
          <h4 className="font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link to="/category/Dresses" className="hover:text-white">Dresses</Link></li>
            <li><Link to="/category/Tops" className="hover:text-white">Tops</Link></li>
            <li><Link to="/category/Jeans" className="hover:text-white">Jeans</Link></li>
            <li><Link to="/category/Sarees" className="hover:text-white">Sarees</Link></li>
            <li><Link to="/category/Kurtis" className="hover:text-white">Kurtis</Link></li>
            <li><Link to="/category/Shirts" className="hover:text-white">Shirts</Link></li>
            <li><Link to="/category/Trousers" className="hover:text-white">Trousers</Link></li>
          </ul>
        </div>

        {/* Fabric + service links */}
        <div>
          <h4 className="font-semibold mb-3">Fabric &amp; Services</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link to="/fabric/Silk" className="hover:text-white">Silk</Link></li>
            <li><Link to="/fabric/Cotton" className="hover:text-white">Cotton</Link></li>
            <li><Link to="/fabric/Linen" className="hover:text-white">Linen</Link></li>
            <li><Link to="/fabric/Chiffon" className="hover:text-white">Chiffon</Link></li>
            <li className="flex items-center gap-1 pt-2">
              <Scissors className="w-4 h-4" />
              <Link to="/tailor" className="hover:text-white">Tailor Service</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@stylecart.in</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> MG Road, Bengaluru</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/20 py-4 text-center text-xs text-cream/60">
        &copy; {new Date().getFullYear()} STYLECART. College project — for demonstration purposes.
      </div>
    </footer>
  );
}
