// ===== Login / Sign Up Page =====
// Allows new users to create an account and existing users to log in.
// Uses the Java Spring Boot authentication API.
// After successful login, the user is redirected to the home page.

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result =
      mode === 'login'
        ? await signIn(email, password)
        : await signUp(name, email, password);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // On success, go to home
    navigate('/');
  }

  return (
    <div className="bg-[#faf7f2] min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <ShoppingBag className="w-7 h-7 text-[#800020]" />
            <span className="text-xl font-bold text-[#800020]">STYLECART</span>
          </div>
          <h1 className="text-lg font-bold text-gray-800">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login'
              ? 'Sign in to your account to continue shopping'
              : 'Sign up to start shopping and place orders'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
              />
            </div>
          )}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020]"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#800020] text-white font-semibold py-3 rounded-lg hover:bg-[#6b0019] transition-colors disabled:opacity-50"
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        {/* Toggle login / signup */}
        <p className="text-center text-sm text-gray-500 mt-5">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError(null);
            }}
            className="text-[#800020] font-medium hover:underline"
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-gray-400 hover:underline">
            Continue without account
          </Link>
        </div>
      </div>
    </div>
  );
}
