'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
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
            Join MemeForge
          </h1>
          <p className="text-gray-600">
            Create your free account and get 50 generations per day
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
              <label htmlFor="username" className="block text-sm font-bold text-cartoon-dark mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                className="input-cartoon"
                placeholder="cool_memer_123"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">3-20 characters, letters, numbers, and underscores only</p>
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-cartoon-dark mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="input-cartoon"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cartoon btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Login here
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="text-center space-y-2 text-sm text-gray-600">
              <p className="font-semibold">🎨 Free Account Benefits:</p>
              <p>✅ 50 generations per day</p>
              <p>✅ Save your creations</p>
              <p>✅ Create custom characters</p>
              <p>✅ Upload custom assets</p>
              <p>✅ Share to community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
