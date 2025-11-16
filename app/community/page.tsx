'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CommunityMeme {
  id: number;
  image_url: string;
  prompt: string;
  likes: number;
  views: number;
  created_at: string;
}

export default function CommunityPage() {
  const [memes, setMemes] = useState<CommunityMeme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMemes();
  }, []);

  const loadMemes = async () => {
    try {
      const response = await fetch('/api/community/memes');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load memes');
      }

      setMemes(data.memes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (memeId: number) => {
    try {
      await fetch(`/api/community/memes/${memeId}/like`, {
        method: 'POST',
      });

      // Update local state
      setMemes(memes.map(meme =>
        meme.id === memeId
          ? { ...meme, likes: meme.likes + 1 }
          : meme
      ));
    } catch (error) {
      console.error('Failed to like meme:', error);
    }
  };

  return (
    <div className="min-h-screen bg-cartoon-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-cartoon-dark mb-4">
            Community Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Check out amazing memes created by our community. Get inspired and create your own!
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-semibold">Loading epic memes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😢</div>
            <p className="text-gray-600 font-semibold">{error}</p>
          </div>
        ) : memes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-gray-600 font-semibold mb-4">No memes yet!</p>
            <p className="text-gray-500 mb-6">Be the first to share your creation</p>
            <a href="/generate" className="btn-cartoon btn-primary inline-block">
              Create First Meme
            </a>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="card-cartoon text-center">
                <div className="text-4xl mb-2">🎨</div>
                <div className="text-3xl font-black text-primary mb-1">{memes.length}</div>
                <div className="text-gray-600 font-semibold">Total Memes</div>
              </div>
              <div className="card-cartoon text-center">
                <div className="text-4xl mb-2">❤️</div>
                <div className="text-3xl font-black text-primary mb-1">
                  {memes.reduce((sum, m) => sum + m.likes, 0)}
                </div>
                <div className="text-gray-600 font-semibold">Total Likes</div>
              </div>
              <div className="card-cartoon text-center">
                <div className="text-4xl mb-2">👀</div>
                <div className="text-3xl font-black text-primary mb-1">
                  {memes.reduce((sum, m) => sum + m.views, 0)}
                </div>
                <div className="text-gray-600 font-semibold">Total Views</div>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memes.map((meme) => (
                <div key={meme.id} className="card-cartoon group">
                  {/* Image */}
                  <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-3 border-cartoon-dark mb-4">
                    <Image
                      src={meme.image_url}
                      alt={meme.prompt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      unoptimized
                    />
                  </div>

                  {/* Prompt */}
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2 font-medium">
                    {meme.prompt}
                  </p>

                  {/* Stats & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <span>👀</span>
                        <span className="font-semibold">{meme.views}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>❤️</span>
                        <span className="font-semibold">{meme.likes}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleLike(meme.id)}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-lg border-2 border-red-300 transition-all hover:scale-105"
                    >
                      ❤️ Like
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <div className="inline-block bg-white border-4 border-cartoon-dark rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(45,55,72,1)]">
                <h3 className="text-2xl font-black text-cartoon-dark mb-3">
                  Ready to Create Your Own?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join the community and start making epic memes
                </p>
                <a href="/generate" className="btn-cartoon btn-primary text-lg px-8">
                  🚀 Start Creating
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
