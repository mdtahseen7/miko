'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getLocalStorage } from '@/lib/utils';
import Navbar from '@/components/Navbar';

function WatchSportsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [watchLaterCount, setWatchLaterCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const url = searchParams.get('url');
  const title = searchParams.get('title');

  useEffect(() => {
    // Load watch later count
    const watchLater = getLocalStorage('watchLater', []);
    setWatchLaterCount(watchLater.length);

    // Handle scroll for navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleViewChange = (view: string) => {
    if (view === 'home') {
      router.push('/');
    } else if (view === 'livesports') {
      router.push('/livesports');
    } else if (view === 'settings') {
      router.push('/settings');
    } else {
      router.push(`/?view=${view}`);
    }
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query) {
      router.push(`/?search=${encodeURIComponent(query)}`);
    }
  };

  if (!url || !title) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Stream</h1>
          <Link href="/livesports" className="text-red-500 hover:text-red-400">
            Return to Live Sports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar
        currentView="watch-sports"
        showSearch={showSearch}
        searchQuery={searchQuery}
        watchLaterCount={watchLaterCount}
        isScrolled={isScrolled}
        onViewChange={handleViewChange}
        onSearchToggle={handleSearchToggle}
        onSearchChange={handleSearchChange}
      />

      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{decodeURIComponent(title)}</h1>
            <div className="flex items-center space-x-4 text-gray-300">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mr-2"></div>
                Live Stream
              </span>
            </div>
          </div>

          {/* Video Player */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
            <iframe
              src={decodeURIComponent(url)}
              className="w-full h-full"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation"
              title={decodeURIComponent(title)}
            />
          </div>

          {/* Stream Info */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Stream Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Match Details</h3>
                <p className="text-gray-400">{decodeURIComponent(title)}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Stream Status</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-red-500">Live Broadcasting</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-400">
                <strong>Note:</strong> This is a live sports stream. Quality and availability may vary based on the source.
                If you experience any issues, try refreshing the page or going back to select a different stream.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/livesports"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Browse More Sports
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Refresh Stream
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WatchSportsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    }>
      <WatchSportsContent />
    </Suspense>
  );
}
