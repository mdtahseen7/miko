'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchSportsMatches, getLocalStorage } from '@/lib/utils';
import type { SportsMatch } from '@/lib/types';
import Navbar from '@/components/Navbar';

export default function LiveSportsPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<SportsMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [watchLaterCount, setWatchLaterCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    loadMatches();
    
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

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await fetchSportsMatches();
      setMatches(data || []);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMatches = () => {
    let filtered = matches;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(match => 
        match.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(match =>
        match.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getUniqueCategories = () => {
    const categories = matches.map(match => match.category);
    return [...new Set(categories)];
  };

  const handleViewChange = (view: string) => {
    if (view === 'home') {
      router.push('/');
    } else if (view === 'livesports') {
      // Already on livesports page
      return;
    } else if (view === 'settings') {
      router.push('/settings');
    } else {
      router.push(`/?view=${view}`);
    }
  };

  const handleSearchToggle = () => {
    window.location.href = '/search';
  };

  const handleSearchChange = () => {};

  const MatchCard = ({ match }: { match: SportsMatch }) => (
    <div className="group bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-white text-lg group-hover:text-red-500 transition-colors">
            {match.title}
          </h3>
          <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
            LIVE
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-gray-400 text-sm">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {match.category}
            </span>
          </p>
          
          <p className="text-gray-400 text-sm">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {match.time} - {match.date}
            </span>
          </p>
        </div>
        
        <Link
          href={`/watch-sports?url=${encodeURIComponent(match.url)}&title=${encodeURIComponent(match.title)}`}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 5v10l7-5z"/>
          </svg>
          Watch Live
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar
        currentView="livesports"
        showSearch={showSearch}
        searchQuery={searchQuery}
        watchLaterCount={watchLaterCount}
        isScrolled={isScrolled}
        onViewChange={handleViewChange}
        onSearchToggle={handleSearchToggle}
        onSearchChange={handleSearchChange}
      />

      {/* Main content */}
      <main className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Live Sports</h1>
            <p className="text-gray-400">Watch live sports matches from around the world</p>
          </div>

          {/* Search and filters */}
          <div className="mb-8 flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search matches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
            >
              <option value="all">All Sports</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Live indicator */}
          <div className="mb-6 flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-red-500 font-semibold">LIVE NOW</span>
            <span className="text-gray-400">({getFilteredMatches().length} matches)</span>
          </div>

          {/* Matches grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getFilteredMatches().map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
              
              {getFilteredMatches().length === 0 && (
                <div className="text-center py-20">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400 text-lg">
                    {searchQuery || selectedCategory !== 'all' 
                      ? 'No matches found for your search criteria' 
                      : 'No live matches available at the moment'
                    }
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Check back later for live sports content
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
