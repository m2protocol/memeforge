'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token
      localStorage.setItem('token', data.token);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-cartoon-bg">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-cartoon-dark mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600">
            Login to continue creating epic memes
          </p>
        </div>

        <div className="card-cartoon">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border-3 border-red-500 text-red-700 px-4 py-3 rounded-lg font-semibold">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-cartoon-dark mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="input-cartoon"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-cartoon-dark mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="input-cartoon"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cartoon btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/generate" className="text-sm text-gray-500 hover:text-primary transition-colors">
              Continue as guest (5 generations/day)
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block bg-white border-4 border-cartoon-dark rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(45,55,72,1)]">
            <p className="font-bold text-cartoon-dark mb-2">Why create an account?</p>
            <div className="text-left space-y-1 text-sm text-gray-600">
              <p>🚀 50 generations/day (vs 5 for guests)</p>
              <p>💾 Save your meme history</p>
              <p>🎭 Create custom characters</p>
              <p>🖼️ Upload custom assets</p>
              <p>🌟 Share to community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
