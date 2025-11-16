'use client';

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t-4 border-cartoon-dark mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logos/logo-horizontal.png"
                alt="MemeForge"
                width={180}
                height={54}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-600 mb-4 max-w-md">
              Free cartoon crypto meme generator for the community. Create amazing memes without limits or complexity.
            </p>
            <p className="text-sm text-gray-500 font-bold">
              100% Free Forever • No Premium Plans • Community First
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-cartoon-dark mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/generate" className="text-gray-600 hover:text-primary transition-colors font-medium">
                  Generate Memes
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 hover:text-primary transition-colors font-medium">
                  Community Gallery
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary transition-colors font-medium">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-cartoon-dark mb-4 text-lg">About</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 font-medium">
                🎨 Cartoon Style Only
              </li>
              <li className="text-gray-600 font-medium">
                🚀 No Registration Limits
              </li>
              <li className="text-gray-600 font-medium">
                💎 Free: 5/day Guest
              </li>
              <li className="text-gray-600 font-medium">
                ⚡ Free: 50/day Registered
              </li>
              <li className="text-gray-600 font-medium">
                🌟 Open Source
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © {currentYear} MemeForge by <a
              href="https://github.com/m2protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary hover:underline"
            >
              M2 Protocol
            </a>. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/m2protocol/memeforge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
