'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  currentView: string;
  showSearch: boolean;
  searchQuery: string;
  watchLaterCount: number;
  isScrolled: boolean;
  onViewChange: (view: string) => void;
  onSearchToggle: () => void;
  onSearchChange: (query: string) => void;
}

export default function Navbar({
  currentView,
  showSearch,
  searchQuery,
  watchLaterCount,
  isScrolled,
  onViewChange,
  onSearchToggle,
  onSearchChange
}: NavbarProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    return null; // Don't render navbar on auth pages
  }

  const handleViewChange = (view: string) => {
    onViewChange(view);
  };

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    if (value) {
      onViewChange('search');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b backdrop-blur-md ${
        currentView === 'home' && !showSearch && !isScrolled
          ? 'bg-gradient-to-b from-black/60 to-black/20 border-transparent'
          : 'bg-black/80 border-black/20 shadow-md'
      }`}
    >
      <div className="w-full px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Nav */}
          <div className="flex items-center space-x-10">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/logo.png" alt="Miko" width={40} height={40} />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] bg-clip-text text-transparent tracking-wide">
                Miko
              </span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              {['home', 'movies', 'tv', 'anime', 'livesports', 'watchlater'].map((view) => (
                <button
                  key={view}
                  onClick={() => handleViewChange(view)}
                  className={`transition duration-200 transform hover:scale-105 hover:text-[#4b7be4] text-sm font-medium whitespace-nowrap ${
                    currentView === view || (currentView === 'watch-sports' && view === 'livesports') ? 'text-[#3a96fe] font-semibold' : 'text-gray-400'
                  }`}
                >
                  {view === 'watchlater'
                    ? `Watch Later (${watchLaterCount})`
                    : view === 'tv'
                    ? 'TV Shows'
                    : view === 'livesports'
                    ? 'Live Sports'
                    : view === 'hollywood'
                    ? 'Hollywood'
                    : view === 'bollywood'
                    ? 'Bollywood'
                    : view === 'anime'
                    ? 'Anime'
                    : view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* LIVE Indicator & Icons */}
          <div className="flex items-center space-x-3">
            {currentView === 'watch-sports' && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-semibold text-sm">LIVE</span>
              </div>
            )}
            
            <button
              onClick={onSearchToggle}
              className="p-2.5 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <Link
              href="/settings"
              className="p-2.5 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>
            
            {/* User Authentication */}
            {!isLoaded ? (
              <div className="w-9 h-9 bg-gray-700 rounded-full animate-pulse"></div>
            ) : isSignedIn ? (
              <div className="relative">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 border-2 border-transparent hover:border-purple-400 transition-colors"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="relative group">
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] text-white text-sm font-medium rounded-lg hover:from-[#7B1FA2] hover:to-[#E91E63] transition-all duration-200 shadow-lg hover:shadow-purple-500/25">
                    Sign Up
                  </button>
                </SignUpButton>
                
                {/* Hidden Sign In Option */}
                <div className="absolute right-0 mt-2 w-32 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <SignInButton mode="modal">
                      <button className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full text-left">
                        Sign In
                      </button>
                    </SignInButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="mt-3">
            <div className="max-w-lg mx-auto relative">
              <div className="relative flex items-center">
                <svg 
                  className="absolute left-3 w-4 h-4 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-16 py-2.5 bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-white placeholder-gray-400 transition-all duration-200 font-medium"
                  autoFocus
                />
                <div className="absolute right-3 flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-400 bg-gray-700/60 border border-gray-600/50 rounded">
                    ⌘
                  </kbd>
                  <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-400 bg-gray-700/60 border border-gray-600/50 rounded">
                    K
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
