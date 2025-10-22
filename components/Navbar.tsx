'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
    return null;
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
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-150 ease-out ${
        (isScrolled || showSearch)
          ? 'miko-navbar-glass'
          : 'miko-navbar-top'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-full px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Nav */}
          <div className="flex items-center space-x-10">
            <Link 
              href="/" 
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              onClick={(e) => {
                if (typeof window !== 'undefined' && window.location.pathname === '/') {
                  e.preventDefault();
                }
                handleViewChange('home');
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <Image src="/logo.png" alt="Miko" width={40} height={40} />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] bg-clip-text text-transparent tracking-wide">
                Miko
              </span>
            </Link>

            <nav className="hidden lg:flex space-x-7 ml-8">{/* Adjusted spacing */}
              {['home', 'movies', 'tv', 'anime', 'watchlater'].map((view, index) => {
                const active = currentView === view || (currentView === 'watch-sports' && view === 'livesports');
                const label = view === 'watchlater'
                  ? `My List (${watchLaterCount})`
                  : view === 'tv'
                  ? 'TV Shows'
                  : view === 'hollywood'
                  ? 'Hollywood'
                  : view === 'bollywood'
                  ? 'Bollywood'
                  : view === 'anime'
                  ? 'Anime'
                  : view.charAt(0).toUpperCase() + view.slice(1);
                return (
                  <motion.button
                    key={view}
                    onClick={() => handleViewChange(view)}
                    aria-current={active ? 'page' : undefined}
                    className={`relative px-0 py-0 text-sm font-medium tracking-wide transition-all duration-150 group focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 rounded-sm ${
                      active ? '' : 'text-white/80 hover:text-white'
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={`relative inline-block ${active ? 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-purple-300 to-fuchsia-400' : ''}`}>
                      {label}
                      <motion.span
                        className={`absolute left-0 right-0 -bottom-1 h-[2px] rounded-full origin-center bg-gradient-to-r from-fuchsia-400 via-purple-400 to-fuchsia-400`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: active ? 1 : 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.15 }}
                      />
                    </span>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Right side icons & user */}
          <div className="flex items-center space-x-5">
            {currentView === 'watch-sports' && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-red-600/90 backdrop-blur-sm rounded-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-medium text-xs uppercase tracking-wide">LIVE</span>
              </div>
            )}
            
            <Link
              href="/search"
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-100 group"
              title="Search"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))' }}
            >
              <svg className="w-5 h-5 text-white group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            <Link
              href="/settings"
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-100 group"
              title="Settings"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))' }}
            >
              <svg className="w-5 h-5 text-white hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>
            
            {/* User Authentication */}
            {!isLoaded ? (
              <div className="w-8 h-8 bg-gray-600/50 rounded-full animate-pulse"></div>
            ) : isSignedIn ? (
              <div className="relative">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 rounded-full hover:ring-2 hover:ring-white/30 transition-all duration-100"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="relative group">
                <SignUpButton mode="modal">
                  <button className="px-4 py-1.5 rounded-sm text-white text-sm font-semibold tracking-wide transition-all duration-150 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-fuchsia-600 hover:from-fuchsia-400 hover:via-purple-500 hover:to-fuchsia-500 shadow-md shadow-fuchsia-900/40 hover:shadow-fuchsia-700/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60">
                    Sign Up
                  </button>
                </SignUpButton>
                
                <div className="absolute right-0 mt-2 w-28 bg-black/95 backdrop-blur-lg border border-white/10 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-100 z-50">
                  <div className="py-1">
                    <SignInButton mode="modal">
                      <button className="block px-3 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-colors w-full text-left">
                        Sign In
                      </button>
                    </SignInButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
