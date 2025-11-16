'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/generate", label: "Generate" },
    { href: "/community", label: "Community" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b-4 border-cartoon-dark sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logos/logo-horizontal.png"
              alt="MemeForge"
              width={200}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-6 py-2 rounded-lg font-bold transition-all duration-150 border-3 border-transparent
                  ${isActive(link.href)
                    ? 'bg-primary text-white border-cartoon-dark shadow-[3px_3px_0px_0px_rgba(45,55,72,1)]'
                    : 'hover:bg-gray-100 text-cartoon-dark'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/login"
              className="px-6 py-2 font-bold text-cartoon-dark hover:bg-gray-100 rounded-lg transition-all"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="btn-cartoon btn-primary"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-gray-200">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-bold transition-all
                    ${isActive(link.href)
                      ? 'bg-primary text-white border-3 border-cartoon-dark'
                      : 'hover:bg-gray-100 text-cartoon-dark'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-center font-bold text-cartoon-dark hover:bg-gray-100 rounded-lg transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block btn-cartoon btn-primary text-center"
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
