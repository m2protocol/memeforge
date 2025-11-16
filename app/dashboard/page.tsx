'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface UserMeme {
  id: number;
  image_url: string;
  prompt: string;
  likes: number;
  views: number;
  is_public: boolean;
  created_at: string;
}

interface UserStats {
  totalMemes: number;
  totalLikes: number;
  totalViews: number;
  generationsToday: number;
  dailyLimit: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [memes, setMemes] = useState<UserMeme[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        throw new Error(data.error || 'Failed to load dashboard');
      }

      setMemes(data.memes);
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePublic = async (memeId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/memes/${memeId}/visibility`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublic: !currentStatus }),
      });

      setMemes(memes.map(meme =>
        meme.id === memeId
          ? { ...meme, is_public: !currentStatus }
          : meme
      ));
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    }
  };

  const deleteMeme = async (memeId: number) => {
    if (!confirm('Are you sure you want to delete this meme?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/memes/${memeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setMemes(memes.filter(meme => meme.id !== memeId));
    } catch (error) {
      console.error('Failed to delete meme:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cartoon-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cartoon-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <p className="text-gray-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cartoon-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-cartoon-dark mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your memes and track your stats
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="card-cartoon text-center">
              <div className="text-4xl mb-2">🎨</div>
              <div className="text-3xl font-black text-primary mb-1">{stats.totalMemes}</div>
              <div className="text-sm text-gray-600 font-semibold">Total Memes</div>
            </div>
            <div className="card-cartoon text-center">
              <div className="text-4xl mb-2">❤️</div>
              <div className="text-3xl font-black text-primary mb-1">{stats.totalLikes}</div>
              <div className="text-sm text-gray-600 font-semibold">Total Likes</div>
            </div>
            <div className="card-cartoon text-center">
              <div className="text-4xl mb-2">👀</div>
              <div className="text-3xl font-black text-primary mb-1">{stats.totalViews}</div>
              <div className="text-sm text-gray-600 font-semibold">Total Views</div>
            </div>
            <div className="card-cartoon text-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-3xl font-black text-primary mb-1">
                {stats.dailyLimit - stats.generationsToday}
              </div>
              <div className="text-sm text-gray-600 font-semibold">Remaining Today</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <a href="/generate" className="card-cartoon hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-cartoon-dark mb-2">🚀 Generate New Meme</h3>
                <p className="text-gray-600">Create your next masterpiece</p>
              </div>
              <div className="text-5xl">➡️</div>
            </div>
          </a>
          <div className="card-cartoon bg-gradient-to-r from-primary to-blue-600 text-white border-cartoon-dark">
            <h3 className="text-xl font-bold mb-2">🎭 Character Builder</h3>
            <p className="mb-4 opacity-90">Create consistent characters (Coming Soon!)</p>
            <button className="btn-cartoon bg-white text-primary border-cartoon-dark opacity-50 cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>

        {/* My Memes */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-cartoon-dark mb-6">My Memes</h2>

          {memes.length === 0 ? (
            <div className="card-cartoon text-center py-12">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-gray-600 font-semibold mb-4">No memes yet!</p>
              <p className="text-gray-500 mb-6">Create your first meme to get started</p>
              <a href="/generate" className="btn-cartoon btn-primary inline-block">
                Create First Meme
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memes.map((meme) => (
                <div key={meme.id} className="card-cartoon">
                  {/* Image */}
                  <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-3 border-cartoon-dark mb-4">
                    <Image
                      src={meme.image_url}
                      alt={meme.prompt}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Prompt */}
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2 font-medium">
                    {meme.prompt}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center space-x-1">
                      <span>👀</span>
                      <span className="font-semibold">{meme.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>❤️</span>
                      <span className="font-semibold">{meme.likes}</span>
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      meme.is_public
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {meme.is_public ? '🌟 Public' : '🔒 Private'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => togglePublic(meme.id, meme.is_public)}
                      className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold rounded-lg border-2 border-blue-300 text-sm transition-all"
                    >
                      {meme.is_public ? '🔒 Hide' : '🌟 Share'}
                    </button>
                    <button
                      onClick={() => deleteMeme(meme.id)}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg border-2 border-red-300 text-sm transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
