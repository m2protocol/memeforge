import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-cartoon-bg py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block bg-cartoon-accent text-cartoon-dark font-bold px-6 py-2 rounded-full border-3 border-cartoon-dark shadow-[4px_4px_0px_0px_rgba(45,55,72,1)] mb-6">
              🎨 100% Free Forever
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 text-cartoon-dark leading-tight">
            Create <span className="text-primary font-logo text-6xl md:text-8xl">Epic</span><br />
            Crypto Memes
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto font-medium">
            The ultimate cartoon-style meme generator for the crypto community.
            No complex tools, no limits, just pure meme magic.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/generate" className="btn-cartoon btn-primary text-lg px-10 py-4">
              🚀 Start Creating
            </Link>
            <Link href="/community" className="btn-cartoon btn-secondary text-lg px-10 py-4">
              🎭 View Gallery
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { emoji: "🎨", label: "Cartoon Style", value: "100%" },
              { emoji: "⚡", label: "Generations/Day", value: "50" },
              { emoji: "💎", label: "Cost", value: "$0" },
              { emoji: "🚀", label: "Speed", value: "Fast" },
            ].map((stat, i) => (
              <div key={i} className="card-cartoon text-center">
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-cartoon-dark">
            Why MemeForge?
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Built for the crypto community, by the crypto community
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "🎭 Pure Cartoon Style",
                description: "Every meme is generated in consistent cartoon crypto style. Think Pepe, Wojak, and classic meme aesthetics. No random styles or inconsistencies.",
              },
              {
                title: "🎯 Character Builder",
                description: "Create your own crypto character once, then use it in unlimited scenarios. Your character stays consistent across all generations.",
              },
              {
                title: "🖼️ Custom Assets",
                description: "Upload your coin logo, project mascot, or any custom asset. We'll integrate them perfectly into your memes while keeping the cartoon style.",
              },
              {
                title: "⚡ Lightning Fast",
                description: "No waiting, no queues. Generate your memes instantly with our optimized AI pipeline powered by OpenAI DALL-E.",
              },
              {
                title: "💰 Totally Free",
                description: "5 generations/day as guest, 50 generations/day with free account. No hidden fees, no premium tiers, no BS.",
              },
              {
                title: "🌟 Community First",
                description: "Share your creations in our community gallery. Get inspired by others. 100% open source and transparent.",
              },
            ].map((feature, i) => (
              <div key={i} className="card-cartoon">
                <h3 className="text-xl font-bold mb-3 text-cartoon-dark">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-cartoon-bg">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-cartoon-dark">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Describe Your Meme",
                description: "Tell us what you want: 'Pepe celebrating gains', 'Wojak panic selling', or anything your meme heart desires.",
              },
              {
                step: "2",
                title: "AI Does the Magic",
                description: "Our cartoon-optimized AI generates your meme in pure crypto cartoon style. No weird text, no random elements.",
              },
              {
                step: "3",
                title: "Download & Share",
                description: "Get your meme instantly. Share it with the community or download for Twitter, Discord, Telegram, wherever!",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white text-2xl font-black rounded-full border-4 border-cartoon-dark shadow-[4px_4px_0px_0px_rgba(45,55,72,1)] mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-cartoon-dark">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/generate" className="btn-cartoon btn-accent text-lg px-12 py-4 inline-block">
              Try It Now - It's Free! 🎨
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Create Epic Memes?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the community and start generating cartoon crypto memes in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-primary font-bold py-4 px-10 rounded-xl border-4 border-cartoon-dark shadow-[6px_6px_0px_0px_rgba(45,55,72,1)] hover:shadow-[4px_4px_0px_0px_rgba(45,55,72,1)] transform transition-all duration-150 active:translate-y-1 text-lg"
            >
              Sign Up (50/day Free)
            </Link>
            <Link
              href="/generate"
              className="bg-cartoon-accent text-cartoon-dark font-bold py-4 px-10 rounded-xl border-4 border-cartoon-dark shadow-[6px_6px_0px_0px_rgba(45,55,72,1)] hover:shadow-[4px_4px_0px_0px_rgba(45,55,72,1)] transform transition-all duration-150 active:translate-y-1 text-lg"
            >
              Try as Guest (5/day)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
