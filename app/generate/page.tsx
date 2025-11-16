'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PROMPT_EXAMPLES } from '@/lib/ai/prompt-engineer';

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<'general' | 'pepe' | 'wojak' | 'cartoon'>('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(5);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status and daily limit
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setDailyLimit(50);
    }
    // Load generation count from today
    loadGenerationCount();
  }, []);

  const loadGenerationCount = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('generationData');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        setGenerationCount(data.count);
      } else {
        // New day, reset count
        localStorage.setItem('generationData', JSON.stringify({ date: today, count: 0 }));
        setGenerationCount(0);
      }
    } else {
      localStorage.setItem('generationData', JSON.stringify({ date: today, count: 0 }));
    }
  };

  const incrementGenerationCount = () => {
    const today = new Date().toDateString();
    const newCount = generationCount + 1;
    localStorage.setItem('generationData', JSON.stringify({ date: today, count: newCount }));
    setGenerationCount(newCount);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (generationCount >= dailyLimit) {
      setError(`You've reached your daily limit of ${dailyLimit} generations. ${isLoggedIn ? 'Come back tomorrow!' : 'Sign up for 50/day!'}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedImage({
        url: data.imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
      });

      incrementGenerationCount();
      setPrompt(''); // Clear prompt after successful generation
    } catch (err: any) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `memeforge-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = () => {
    if (!generatedImage) return;
    // TODO: Implement share to community
    alert('Share to community coming soon!');
  };

  const useExample = (example: string) => {
    setPrompt(example);
  };

  const remainingGenerations = dailyLimit - generationCount;

  return (
    <div className="min-h-screen bg-cartoon-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-cartoon-dark mb-3">
            Generate Your Meme
          </h1>
          <p className="text-gray-600 text-lg">
            Describe your idea and watch the magic happen
          </p>
          <div className="mt-4 inline-block">
            <div className={`font-bold px-6 py-2 rounded-full border-3 border-cartoon-dark ${
              remainingGenerations > 10 ? 'bg-green-100 text-green-700' :
              remainingGenerations > 0 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {remainingGenerations}/{dailyLimit} generations left today
              {!isLoggedIn && ' (Sign up for 50/day!)'}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Generator */}
          <div className="space-y-6">
            {/* Style Selection */}
            <div className="card-cartoon">
              <h3 className="text-xl font-bold text-cartoon-dark mb-4">🎨 Choose Style</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'general', label: 'General Crypto', emoji: '🌟' },
                  { value: 'pepe', label: 'Pepe Style', emoji: '🐸' },
                  { value: 'wojak', label: 'Wojak Style', emoji: '😐' },
                  { value: 'cartoon', label: 'Modern Cartoon', emoji: '🎭' },
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value as any)}
                    className={`p-4 rounded-lg border-3 font-bold transition-all ${
                      style === s.value
                        ? 'bg-primary text-white border-cartoon-dark shadow-[4px_4px_0px_0px_rgba(45,55,72,1)]'
                        : 'bg-white text-cartoon-dark border-gray-300 hover:border-primary'
                    }`}
                  >
                    <div className="text-2xl mb-1">{s.emoji}</div>
                    <div className="text-sm">{s.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="card-cartoon">
              <h3 className="text-xl font-bold text-cartoon-dark mb-4">💭 Describe Your Meme</h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Pepe celebrating with rocket ship going to the moon"
                className="input-cartoon min-h-[120px] resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>{prompt.length}/500 characters</span>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim() || generationCount >= dailyLimit}
                className="w-full btn-cartoon btn-primary mt-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Magic...
                  </span>
                ) : (
                  '🚀 Generate Meme'
                )}
              </button>

              {error && (
                <div className="mt-4 bg-red-100 border-3 border-red-500 text-red-700 px-4 py-3 rounded-lg font-semibold">
                  {error}
                </div>
              )}
            </div>

            {/* Examples */}
            <div className="card-cartoon">
              <h3 className="text-xl font-bold text-cartoon-dark mb-4">💡 Example Prompts</h3>
              <div className="space-y-2">
                {PROMPT_EXAMPLES.basic.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => useExample(example)}
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border-2 border-gray-200 hover:border-primary transition-all text-sm font-medium"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Result */}
          <div className="space-y-6">
            <div className="card-cartoon min-h-[600px] flex flex-col">
              <h3 className="text-xl font-bold text-cartoon-dark mb-4">🖼️ Your Meme</h3>

              {generatedImage ? (
                <div className="flex-1 flex flex-col">
                  <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-3 border-cartoon-dark mb-4">
                    <Image
                      src={generatedImage.url}
                      alt={generatedImage.prompt}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>

                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <p className="text-sm font-semibold text-gray-600 mb-1">Prompt:</p>
                    <p className="text-sm text-gray-800">{generatedImage.prompt}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleDownload}
                      className="btn-cartoon btn-accent"
                    >
                      Download
                    </button>
                    <button
                      onClick={handleShare}
                      className="btn-cartoon btn-secondary"
                    >
                      🌟 Share
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div>
                    <div className="text-6xl mb-4">🎨</div>
                    <p className="text-gray-600 font-semibold">
                      Your generated meme will appear here
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Enter a prompt and hit generate!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {!isLoggedIn && (
              <div className="card-cartoon bg-gradient-to-r from-primary to-blue-600 text-white border-cartoon-dark">
                <h3 className="text-xl font-bold mb-2">🚀 Want More?</h3>
                <p className="mb-4">Sign up for free and get 50 generations per day!</p>
                <a href="/register" className="btn-cartoon bg-white text-primary border-cartoon-dark inline-block">
                  Sign Up Free
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
